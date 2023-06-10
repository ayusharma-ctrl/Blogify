import { AccountCircle, CancelRounded, Save } from '@mui/icons-material'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'

const ProfileEdit = ({ setIsEdit, currName, currUsername, setDataUpdater }) => {
    const [name, setName] = React.useState(currName)
    const [username, setUsername] = React.useState(currUsername)

    const handleSave = async () => {
        if (name === "" || username === "") {
            toast.error('Both fields are required');
            return
        }
        if (username.length < 3 || name.length < 3) {
            toast.error('Please enter a valid username or name');
            return
        }
        try {
            const { data } = await axios.post("/api/user/profile/update",
                { name: name, username: username },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (!data.success) {
                toast.error(data.message)
                return
            } else {
                toast.success(data.message)
                setIsEdit(false)
                setDataUpdater(prev => prev + 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.8rem' }}>
            <h1>Edit Profile Details</h1>
            <div>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-name">Name</InputLabel>
                    <Input
                        id="standard-adornment-name"
                        type='text'
                        value={name}
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
                        value={username}
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
            <div style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                <Button variant="contained" color='error' onClick={() => setIsEdit(false)} endIcon={<CancelRounded />}>
                    Cancel
                </Button>
                <Button variant="contained" color='success' sx={{ ml: 1 }} onClick={handleSave} endIcon={<Save />}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default ProfileEdit