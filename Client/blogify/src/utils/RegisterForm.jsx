import { AccountCircle, AppRegistrationRounded, Login, Visibility, VisibilityOff, EmailRounded } from '@mui/icons-material';
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import React from 'react'
import { toast } from 'react-toastify';
import * as EmailValidator from 'email-validator'
import axios from 'axios'

const RegisterForm = ({ setLogin }) => {
    const [name, setName] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRegister = async () => {
        if (!name || !username || !email || !password || !confirmPassword) {
            toast.error("All Fields are required")
            return
        }
        if (!EmailValidator.validate(email)) {
            toast.error("Email is not valid.")
            return
        }
        if (name.length < 3 || username.length < 3 || password.length < 6) {
            toast.error("Enter a valid name, username & password.")
            return
        }
        if (password !== confirmPassword) {
            toast.error("Password & Confirm Password should be same.")
            return
        }
        try {
            const { data } = await axios.post("https://blogify-ayusharma-ctrl.onrender.com/api/user/register",
                { name: name, username: username, email: email, password: password, confirmPassword: confirmPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (data.success) {
                toast.success(data.message)
                setTimeout(() => {
                    setLogin(prev => !prev)
                }, 1000)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2.5rem' }}>
            <h1>Register</h1>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-name">Name</InputLabel>
                    <Input
                        id="standard-adornment-name"
                        type='text'
                        onChange={(e) => setName(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <AccountCircle />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
                    <Input
                        id="standard-adornment-username"
                        type='text'
                        onChange={(e) => setUsername(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <AccountCircle />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                    <Input
                        id="standard-adornment-email"
                        type='text'
                        onChange={(e) => setEmail(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <EmailRounded />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-confirmPassword">Confirm Password</InputLabel>
                    <Input
                        id="standard-adornment-confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            <div style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                <Button variant="contained" color='warning' onClick={handleRegister} endIcon={<AppRegistrationRounded />}>
                    Register
                </Button>
            </div>
            <h3>OR</h3>
            <div style={{ marginTop: '0.5rem' }}>
                <Button variant="contained" onClick={() => setLogin(prev => !prev)} endIcon={<Login />}>
                    Login
                </Button>
            </div>
        </div>
    )
}

export default RegisterForm