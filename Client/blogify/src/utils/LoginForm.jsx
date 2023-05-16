import React, { useState } from 'react'
import { IconButton, Input, InputAdornment, InputLabel, FormControl, Box, TextField, Button } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff, Login, AppRegistrationRounded } from '@mui/icons-material'

const LoginForm = ({ setLogin, setUsername, setPassword, handleLogin, setReset, setVerify }) => {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem' }}>
            <h1>LOGIN</h1>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-username">Email or Username</InputLabel>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.8rem', color: 'steelblue', marginTop: '0.5rem' }}>
                    <span onClick={() => setReset(true)} style={{ cursor: 'pointer' }} > Forget your password? </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.8rem', color: 'steelblue', marginTop: '0.5rem' }}>
                    <span onClick={() => setVerify(true)} style={{ cursor: 'pointer' }}> Verify your account? </span>
                </div>
            </div>
            <div style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                <Button variant="contained" onClick={handleLogin} endIcon={<Login />}>
                    Login
                </Button>
            </div>
            <h3>OR</h3>
            <div style={{ marginTop: '0.5rem' }}>
                <Button variant="contained" color='warning' onClick={() => setLogin(prev => !prev)} endIcon={<AppRegistrationRounded />}>
                    Register
                </Button>
            </div>
        </div>
    )
}

export default LoginForm