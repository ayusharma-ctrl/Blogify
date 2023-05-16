import { CancelRounded, Save, Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import React from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const PasswordChange = ({ setPasswordChange }) => {
    const [currentPass, setCurrentPass] = React.useState("")
    const [newPass, setNewPass] = React.useState("")
    const [confirmPass, setConfirmPass] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = async () => {
        if (!currentPass || !newPass || !confirmPass) {
            toast.error("All fields are required!")
            return;
        }
        if (currentPass.length < 6 || newPass.length < 6 || confirmPass.length < 6) {
            toast.error("Password is too weak")
            return;
        }
        if (currentPass === newPass) {
            toast.error("New Password should be unique")
            return;
        }
        if (newPass !== confirmPass) {
            toast.error("New Password & Confirm Password should match")
            return;
        }
        try {
            const { data } = await axios.post("https://blogify-ayusharma-ctrl.onrender.com/api/user/password/update",
                { currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmPass },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if(data.success){
                toast.success(data.message)
                setPasswordChange(false)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.8rem' }}>
            <h1>Update Your Password</h1>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-currPassword">Current Password</InputLabel>
                    <Input
                        id="standard-adornment-currPassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setCurrentPass(e.target.value)}
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
                    <InputLabel htmlFor="standard-adornment-newPassword">New Password</InputLabel>
                    <Input
                        id="standard-adornment-newPassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setNewPass(e.target.value)}
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
                        onChange={(e) => setConfirmPass(e.target.value)}
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
                <Button variant="contained" color='error' onClick={() => setPasswordChange(false)} endIcon={<CancelRounded />}>
                    Cancel
                </Button>
                <Button variant="contained" color='success' sx={{ ml: 1 }} onClick={handlePasswordChange} endIcon={<Save />}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default PasswordChange