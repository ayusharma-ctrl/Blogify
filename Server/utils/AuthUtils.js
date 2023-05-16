import validator from "validator";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// func to clean up and validate the received data from client side, this will return a promise either reject or resolve
export const cleanupAndValidateRegister = ({ name, username, email, password, confirmPassword }) => {
    return new Promise((resolve, reject) => {
        if (!name || !username || !email || !password || !confirmPassword) {
            reject("Missing Credentials");
        }
        if (typeof name !== "string") reject("Invalid Email");
        if (typeof email !== "string") reject("Invalid Name");
        if (typeof username !== "string") reject("Invalid Username");

        if (name.length <= 2 || name.length > 50) {
            reject("Name should be 3-50 charachters long");
        }
        if (username.length <= 2 || username.length > 20) {
            reject("Username should be 3-20 charachters long");
        }
        if (password.length < 5 || password.length > 25) {
            reject("Password should be 5-25 charachters long");
        }
        if (!validator.isEmail(email)) {
            reject("Invalid Email!");
        }
        if (password !== confirmPassword) {
            reject("Password and Confirm Password are not same!");
        }

        resolve();
    })
}

// func to create a JWT token
export const generateJwtToken = (email) => {
    const token = jwt.sign(email, process.env.JWT_SECRET);
    return token;
}

// func to send a mail along with ejs template and jwt token for verification
export const sendVerificationTokenViaEmail = async ({ token, email, pageTitle, subject, content, requestType }) => {
    //creating transporter
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    // variables -> this link will be send in mail which is an api
    const link = `${process.env.SERVER_URL}/api/user/${requestType}/${token}`;
    // this is to define __dirname in ES6 module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // mail options define how we send a mail, we will render ejs email template in a mail
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: await ejs.renderFile(path.join(__dirname, '../views/EmailTemplate.ejs'), {
            title: `${pageTitle}`,
            mailContent: `${content}`,
            appName: 'Blogify',
            resetLink: `${link}`,
        })
    };

    // finally function to send a mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent successfully: " + info.response);
        }
    })

    return;
}