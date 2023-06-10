import React from 'react'
import { Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// components-import
import LoginForm from '../utils/LoginForm';
import RegisterForm from '../utils/RegisterForm';
import VerifyResetDialog from '../utils/VerifyResetDialog';
import { AuthContext } from '../navs/Navs';


// variables
const verifyTitle = "Enter your email or username to verify your account:"
const resetTitle = "Enter your email or username to reset your password:"
const resetBtnText = "Reset"
const verifyBtnText = "Verify"

const Login = () => {
    const [login, setLogin] = React.useState(true)
    const [reset, setReset] = React.useState(false)
    const [verify, setVerify] = React.useState(false)
    const [usernameEmail, setUsernameEmail] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const { setAuth } = React.useContext(AuthContext)

    const navigate = useNavigate()

    // send request to receive another verification link via email to verify account
    const handleVerifyBtn = async () => {
        if (!usernameEmail || usernameEmail.length < 3) {
            toast.error("Enter a valid username or email")
            return
        }
        try {
            const { data } = await axios.post("/api/user/verify-resend",
                { loginId: usernameEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (data.success) {
                toast.success(data.message)
                setUsernameEmail("")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    // send request to receive password reset mail
    const handleResetBtn = async () => {
        console.log(usernameEmail)
        if (!usernameEmail || usernameEmail.length < 3) {
            toast.error("Enter a valid username or email")
            return
        }
        try {
            const { data } = await axios.post("/api/user/password/reset",
                { loginId: usernameEmail },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (data.success) {
                toast.success(data.message)
                setUsernameEmail("");
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // funct to login
    const handleLogin = async () => {
        if (username === "" || password === "") {
            toast.error('Both fields are required');
            return
        }
        if (username.length < 3 || password.length < 6) {
            toast.error('Please enter a valid username or password');
            return
        }
        try {
            const { data } = await axios.post(`/api/user/login`,
                { loginId: username, password: password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            console.log(data.success)
            if (data.success === false) {
                toast.error(data.message)
                return
            }
            setAuth(true)
            navigate("/dashboard")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <ToastContainer />
            {reset ? (<VerifyResetDialog reset={reset} setReset={setReset} handleResetBtn={handleResetBtn} resetTitle={resetTitle} resetBtnText={resetBtnText} setUsername={setUsernameEmail} />)
                : verify ? (<VerifyResetDialog verify={verify} setVerify={setVerify} handleVerifyBtn={handleVerifyBtn} verifyTitle={verifyTitle} verifyBtnText={verifyBtnText} setUsername={setUsernameEmail} />)
                    : (<Grid container spacing={2} style={{ width: '100vw', height: '94vh', position: 'relative', top: '1rem', margin: 0, padding: 0 }}>
                        <Grid item xs={12} md={12} style={{ width: '40%', backgroundColor: "#F0F2F5" }}>
                            {login ? (<LoginForm setLogin={setLogin} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} setReset={setReset} setVerify={setVerify} />)
                                : (<RegisterForm setLogin={setLogin} />)}
                        </Grid>
                    </Grid>)}
        </div>
    )

}

export default Login