import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar';
import {Box, Toolbar, Typography, IconButton, Menu, MenuItem} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

// coponents-import
import Drawer from '../utils/Drawer';
import { AuthContext } from '../navs/Navs';

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    // destructuring props from AuthContext
    const { auth, name, userID, setAuth } = useContext(AuthContext)
    // to navigate to a different route
    const navigate = useNavigate()

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    // func to close menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // func to navigate to dashboard
    const handleHome = () => {
        navigate('/dashboard')
    }

    //func to navigate to profile page
    const handleProfile = () => {
        navigate(`/profile/${userID}`)
    }

    // func to logout
    const handleLogout = async () => {
        try {
            const { data } = await axios.get("https://blogify-ayusharma-ctrl.onrender.com/api/user/logout")
            if (data.success) {
                setAuth(false)
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 1 }}
                        >
                            <Drawer auth={auth} handleLogout={handleLogout} />
                        </IconButton>
                        <Typography variant="h6" component="div" onClick={handleHome} marginLeft={1} sx={{ flexGrow: 1, cursor: 'pointer' }}>
                            BLOGIFY
                        </Typography>
                        {auth ? (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <Typography sx={{ mr: 1 }}> {name} </Typography>
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        ) : null}
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Header