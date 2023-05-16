import express from 'express';

// file-imports
import { accountVerification, checkSession, resendToken, sendPasswordResetMail, showResetPasswordPage, userLogin, userLogout, userPasswordReset, userPasswordUpdate, userProfile, userProfileAnyone, userProfileUpdate, userRegister } from '../controllers/userController.js';
import { isUserAuthenticated } from '../middlewares/IsAuthMiddleware.js'

//creating a router
const userRouter = express.Router();

// api or route to register a new user
userRouter.post("/register", userRegister);

// api or route to verify user account - this link will be send with email to user
userRouter.get("/verify/:token", accountVerification)

// api or route to resend verification mail
userRouter.post("/verify-resend", resendToken)

// api or route to login user
userRouter.post("/login", userLogin)

// api or route to logout user
userRouter.get("/logout", isUserAuthenticated, userLogout)

// api or route to update/change user password
userRouter.post("/password/update", isUserAuthenticated, userPasswordUpdate)

// api or route to update user profile
userRouter.post("/profile/update", isUserAuthenticated, userProfileUpdate)

// api or route to get user profile details
userRouter.get("/profile", isUserAuthenticated, userProfile)

// api or route to get user profile details of anyone
userRouter.get("/profile/:id", isUserAuthenticated, userProfileAnyone)

// api or route to check session is active or not
userRouter.get("/check-session", checkSession)

// <-------------------- Forget Password -------------------->
// api or route to send mail to reset password
userRouter.post("/password/reset", sendPasswordResetMail)
// api or route to render forget password page - newPassword && confirmPassword
userRouter.get("/password/reset/:token", showResetPasswordPage)
// api or route to reset password
userRouter.post("/password/reset/:token", userPasswordReset)


export default userRouter;