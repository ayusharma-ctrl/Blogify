import express from 'express'
import clc from 'cli-color';
import { config } from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import mongoDbSession from 'connect-mongodb-session';
import http from 'http'
import { Server } from 'socket.io'

//file-imports
import { mongoDbConnection } from './database/Database.js';
import userRouter from './routes/UserRouter.js';
import blogRouter from './routes/BlogRouter.js';
import { commentModel } from './models/CommentModel.js';

//creates a new instance of an Express application
const app = express();

//initializing ".env" file at the beginning so that we can use content of it
config({
    path: "./.env"
})

//connecting server and database, just call this func^
mongoDbConnection();

// variables
const MongoDBStore = mongoDbSession(session);

// initialize store for session
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

// <-------------------------------------------Middlewares Declaration------------------------------------------->

// 1. we'll be sending data in json format, that's why it is required to use this middleware
app.use(express.json());
// 2. we'll be using dynamic routes, in order to read the data from url we have to use this
app.use(express.urlencoded({ extended: true }));
// 3. for session based auth
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
// 4. set 'credentials: true' to pass --> headers, cookies, etc to client
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

// 5. to render ejs files
app.set('view engine', 'ejs');

// 6. route splitting
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

// <-------------------------------------------Middlewares Declaration------------------------------------------->

//it is a test route just to see our server is working
app.get("/", (req, res) => {
    return res.send(`<div style = "background:magenta;padding:100px;height:60vh"><h2>Welcome to My Blogging Server</h2>
    <p>Features...</p>
        <div><ul>
            <li>Protected Routes</li>
            <li>Pagination</li>
            <li>Rate Limiting</li>
            <li>Much more...</li>
        </ul></div>
    </div>`)
})

// creates a new instance of an HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
})

// variable to store the count of total connected users at an instance
let totalUsers = 0;

// initialize socket.io connecttion
io.on("connection", (socket) => {
    totalUsers++;
    io.emit("totalusers", totalUsers)

    // handle incoming blog_id from client
    socket.on("blogID", (blogID) => {
        // Load all comments of this particular blog from MongoDB and send to new client
        commentModel.find({ blog: blogID }).sort({ time: -1 }).then(comments => {
            socket.emit('history', comments);
        });
    })

    // Listen for a "newComment" event from the client
    socket.on("newComment", async ({ blogID, userID, username, comment }) => {
        try {
            // Save the new comment to the database
            const savedComment = await commentModel.create({
                blog: blogID,
                user: userID,
                username: username,
                comment: comment,
            });

            // Emit a "commentAdded" event to the client with the saved comment data
            io.emit("commentAdded", savedComment);

        } catch (error) {
            console.error(error);
        }
    })

    // Handle client disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        totalUsers--;
        io.emit("totalusers", totalUsers)
    });

})

// finally server to listen all the http requests
server.listen(process.env.PORT, () => {
    console.log(clc.magentaBright.italic(`Server is running on port ${process.env.PORT}`))
})