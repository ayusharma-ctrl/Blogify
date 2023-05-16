import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import clc from 'cli-color';

// file-imports
import { userModel } from '../models/UserModel.js';
import { cleanupAndValidateRegister, generateJwtToken, sendVerificationTokenViaEmail } from '../utils/AuthUtils.js';

// func to register a new user
export const userRegister = async (req, res) => {

    let { name, username, email, password, confirmPassword } = req.body

    name = name?.trim();
    username = username?.trim();
    email = email?.trim();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();

    try {
        await cleanupAndValidateRegister({ name, username, email, password, confirmPassword });
    } catch (err) {
        return res.send({
            status:400,
            success: false,
            message: "Credentials are not valid!",
            error: err
        })
    }

    // check for unique email 
    const userObjByEmail = await userModel.findOne({ email: email })
    if (userObjByEmail) {
        return res.send({
            status:400,
            success: false,
            message: "This email is already registered. Either login or use a unique email to create a new account."
        })
    }

    // check for unique username
    const userObjByUsername = await userModel.findOne({ username: username })
    if (userObjByUsername) {
        return res.send({
            status:400,
            success: false,
            message: "This username is already taken. Choose a unique username to create a new account."
        })
    }

    // password hashing to store it in Database
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUNDS))

    // saving user information in database
    const userObj = await userModel.create({
        name: name,
        username: username,
        email: email,
        password: hashedPassword
    })

    await userObj.save();

    // generate a token
    const token = generateJwtToken(email);

    // sending a token via email
    try {
        const pageTitle = "Account Verification"
        const subject = `Hello ${name}, verify your account!`
        const content = `Dear ${name}, thank you for creating a new account. Now it's a time to verify your account.`
        const requestType = "verify"
        await sendVerificationTokenViaEmail({ token, email, pageTitle, subject, content, requestType });
        return res.send({
            status:200,
            success: true,
            message: "We have sent a mail to your registered email. Please verify your account before login!",
        })
    } catch (err) {
        console.log(clc.bgRedBright(err))
        return res.send({
            status:500,
            success: false,
            message: "Internal Server Error!",
            error: err
        })
    }
}

// func to verify user account/token
export const accountVerification = async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        // console.log(decoded);
        try {
            await userModel.findOneAndUpdate(
                { email: decoded },
                { emailAuthenticated: true }
            );
            return res.send("Your account is verified! Please try to login now.")
        } catch (error) {
            return res.send({
                status:500,
                success: false,
                message: "Account Verification Failed!",
                error: error
            });
        }
    });
}

// func to login
export const userLogin = async (req, res) => {
    let { loginId, password } = req.body
    loginId = loginId?.trim();
    password = password?.trim();
    if (!loginId || !password || loginId.length < 3 || password.length < 5) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Credentials!"
        })
    }

    let userObj;

    if (validator.isEmail(loginId)) {
        userObj = await userModel.findOne({ email: loginId })
    } else {
        userObj = await userModel.findOne({ username: loginId })
    }

    if (!userObj) {
        return res.send({
            status:404,
            success: false,
            message: "User not found! Please enter valid credentials or create a new account."
        })
    }

    // check if account is verified or not
    if (userObj.emailAuthenticated === false) {
        return res.send({
            status:400,
            success: false,
            message: "Please verfiy your account before login!",
        });
    }

    // checking if password is valid or not
    const isPasswordCorrect = await bcrypt.compare(password, userObj.password)

    if (!isPasswordCorrect) {
        return res.send({
            status:400,
            success: false,
            message: "Username or Password is invalid!"
        })
    }

    // everything is 'ok', let the user login, session based authentication
    try {
        req.session.isAuth = true;
        req.session.user = {
            userId: userObj._id,
            username: userObj.username,
            email: userObj.email,
            name: userObj.name
        };
        return res.send({
            status:200,
            success: true,
            message: "Login Successfully!",
            data: userObj,
        });
    } catch (error) {
        return res.send({
            status:500,
            success: false,
            message: "Login Failed! Internal server error!",
            error: error,
        });
    }

}

// func to resend-verification token
export const resendToken = async (req, res) => {
    let { loginId } = req.body
    loginId = loginId?.trim();
    if (!loginId || loginId.length < 3) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Credentials!"
        })
    }

    let userObj;

    if (validator.isEmail(loginId)) {
        userObj = await userModel.findOne({ email: loginId })
    } else {
        userObj = await userModel.findOne({ username: loginId })
    }

    if (!userObj) {
        return res.send({
            status:404,
            success: false,
            message: "User not found! Please enter valid email or username."
        })
    }

    // check if account is verified or not
    if (userObj.emailAuthenticated === true) {
        return res.send({
            status:400,
            success: false,
            message: "Your Account is already verified!",
        });
    }

    // get user email
    const email = userObj.email;
    // create a token
    const token = generateJwtToken(email);

    // sending a token via email
    try {
        const pageTitle = "Account Verification"
        const subject = `Hello ${userObj.name}, verify your account!`
        const content = `Dear ${userObj.name}, we have received your request for account verification. Please verify your account.`
        const requestType = "verify"
        await sendVerificationTokenViaEmail({ token, email, pageTitle, subject, content, requestType });
        return res.send({
            status:200,
            success: true,
            message: "We have sent a mail to your registered email. Please verify your account!",
        })

    } catch (error) {
        return res.send({
            status:500,
            success: false,
            message: "Internal Server Error!",
            error: error
        })
    }

}

// func to logout
export const userLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send({
                status:400,
                success: false,
                message: "Logout failed!",
                error: err
            });
        }

        return res.send({
            status:200,
            success: true,
            message: "Logout Successfully!",
        });
    });
}

// func to update User Password
export const userPasswordUpdate = async (req, res) => {
    let { currentPassword, newPassword, confirmPassword } = req.body
    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();
    // check if any value is missing
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Credentials"
        })
    }
    // check if password length is not valid
    if (newPassword.length < 5 || newPassword.length > 25) {
        return res.send({
            status:400,
            success: false,
            message: "Password should be 5-25 charachters long"
        });
    }
    // check if password is not same
    if (newPassword !== confirmPassword) {
        return res.send({
            status:400,
            success: false,
            message: "New Password and Confirm Password should be same."
        });
    }
    // find user
    const userObj = await userModel.findOne({ _id: req.session.user.userId })

    // check if current password is valid or not
    const isPasswordCorrect = await bcrypt.compare(currentPassword, userObj.password)

    if (!isPasswordCorrect) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Password!"
        })
    }

    // check if old & new passwords are same
    if (currentPassword === newPassword) {
        return res.send({
            status:400,
            success: false,
            message: "New Password is not unique!"
        });
    }

    // saving a new password
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS))

    try {
        userObj.password = hashedPassword;
        await userObj.save();
        return res.send({
            status:200,
            success: true,
            message: "Password is changed/updated",
            user: userObj
        });
    } catch (err) {
        return res.send({
            status:500,
            success: false,
            message: "Database Error",
            error: err
        });
    }

}

// func to update User Profile (name && username)
export const userProfileUpdate = async (req, res) => {
    let { name, username } = req.body;
    name = name?.trim();
    username = username?.trim();
    // check if we have both the values
    if (!name || !username) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Data Received"
        });
    }
    // check the length
    if (name.length <= 2 || name.length > 50 || username.length <= 2 || username.length > 20) {
        return res.send({
            status:400,
            success: false,
            message: "Invalid username or name. Please choose a valid name or username!"
        });
    }
    // check if username is unique
    const isUsernameUnique = await userModel.findOne({ username: username })
    if (isUsernameUnique) {
        return res.send({
            status:400,
            success: false,
            message: "Username is not unique! Please choose a unique username"
        });
    }
    // update info in database
    try {
        const userObj = await userModel.findOne({ _id: req.session.user.userId });
        userObj.name = name;
        userObj.username = username;
        await userObj.save();
        return res.send({
            status:400,
            success: true,
            message: "Profile is updated!",
            user: userObj
        });
    } catch (err) {
        return res.send({
            status:500,
            success: false,
            message: "Internal Database Error",
            error: err
        });
    }

}

// func to get user profile info
export const userProfile = async (req, res) => {
    try {
        const userObj = await userModel.findOne({ _id: req.session.user.userId });
        return res.send({
            status:200,
            success: true,
            message: "Your Profile!",
            user: userObj
        });
    } catch (err) {
        return res.send({
            status:500,
            success: false,
            message: "Internal Database Error",
            error: err
        });
    }
}

// func to get user profile of anyone using userId
export const userProfileAnyone = async (req, res) => {
    const userId = req.params.id
    try {
        const userObj = await userModel.findOne({ _id: userId });
        return res.send({
            status:200,
            success: true,
            message: "Your Profile!",
            user: userObj
        });
    } catch (err) {
        return res.send({
            status:500,
            success: false,
            message: "Internal Database Error",
            error: err
        });
    }
}

// route to send forget password mail
export const sendPasswordResetMail = async (req, res) => {
    let { loginId } = req.body;
    loginId = loginId.trim();

    //Data validation
    if (!loginId) {
        return res.send({
            status:400,
            success: false,
            message: "Missing email/username",
        });
    }

    if (typeof loginId !== "string") {
        return res.send({
            status:400,
            success: false,
            message: "Invalid Data Format",
        });
    }

    //find the user obj from loginId
    let userDb;
    if (validator.isEmail(loginId)) {
        userDb = await userModel.findOne({ email: loginId });
    } else {
        userDb = await userModel.findOne({ username: loginId });
    }
    // if no user found with entered email/username
    if (!userDb) {
        return res.send({
            status:400,
            success: false,
            message: "User does not exist, Please register first",
        });
    }

    //genrate token
    const token = generateJwtToken(userDb.email);
    //get user email
    const email = userDb.email;
    // sending a mail to reset password
    try {
        userDb.passwordModify = true;
        await userDb.save();
        const pageTitle = "Account Password Reset"
        const subject = `Hello ${userDb.name}, reset your account password!`;
        const content = `Dear ${userDb.name}, we have received your request. Now it's time to reset your account password.`
        const requestType = "password/reset"
        await sendVerificationTokenViaEmail({ token, email, pageTitle, subject, content, requestType });
        return res.status(200).json({
            success: true,
            message: "We have sent a mail to your registered email. Please reset your password!",
        })
    } catch (error) {
        return res.send({
            status:500,
            success: false,
            message: "Internal Server Error!",
            error: error
        })
    }

}

// func to render forget password page
export const showResetPasswordPage = (req, res) => {
    return res.render("NewPassword.ejs", { token: req.params.token })
}

// func to reset user password
export const userPasswordReset = async (req, res) => {
    let { newPassword, confirmPassword } = req.body;
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();

    //Data validation
    if (!newPassword || !confirmPassword) {
        return res.send({
            status:400,
            success: false,
            message: "Missing credentials!",
        });
    }

    if (newPassword !== confirmPassword) {
        return res.send({
            status:400,
            success: false,
            message: "New Password and Confirm Password are not matching. Try again!",
        });
    }

    if (newPassword.length < 5 || newPassword.length > 25) {
        return res.send({
            status:400,
            success: false,
            message: "Password should be 5-25 characters long.",
        });
    }

    // get token
    const { token } = req.params;

    //find user with this token after decoding it
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        try {
            const userObj = await userModel.findOne({ email: decoded })
            if (!userObj.passwordModify) {
                return res.send("This link is expired!")
            }
            //password hashing
            const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS));
            userObj.password = hashedPassword
            userObj.passwordModify = false
            await userObj.save();
            // await userModel.findOneAndUpdate(
            //     { email: decoded }, //filter query
            //     { password: hashedPassword, passwordModify: false } //update query
            // );
            return res.send("Your Password is Updated! Login with a New Password...")
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Database Error. Unable to change your password at this moment. Try again later!",
            });
        }
    });
}

// func to check if user's session is active or not
export const checkSession = async (req, res) => {
    try {
        if (!req.session.isAuth) {
            return res.send({
                status: 400,
                success: false,
                message: "Invalid session! Please login again."
            })
        }
        else {
            return res.send({
                status: 200,
                success: true,
                message: "Welcome back",
                user: req.session.user
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}