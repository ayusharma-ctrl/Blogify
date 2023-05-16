import * as React from 'react';
import { Box, SwipeableDrawer, List, ListItem, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { DeleteRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../navs/Navs';


export default function Drawer({ auth, handleLogout }) {

    const navigate = useNavigate()

    const { userID } = React.useContext(AuthContext)

    const [state, setState] = React.useState({
        top: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        console.log('toggleDrawer called', anchor, open);
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const handleListItem1 = () => {
        navigate("/dashboard")
    }

    const handleListItem2 = (key) => {
        if (key === 0) {
            navigate(`/profile/${userID}`)
        } else if(key===4){
            handleLogout()
        } else{
            navigate("/dashboard")
        }
    }

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100vh' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Typography variant="h6" component="div" marginLeft={2} sx={{ flexGrow: 1, mt: 4, mb: 2 }}>
                BLOGIFY
            </Typography>
            {
                !auth ? (<List>
                    {['Login', 'Register'].map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {text === "Login" ? <LoginIcon /> : <PersonAddIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>) : (<> <List>
                    {['Home', 'Explore', 'Timeline', "My Blogs"].map((text, index) => (
                        <ListItem key={index} onClick={handleListItem1} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {text === "Home" ? <HomeIcon /> : text === "Explore" ? <ExploreRoundedIcon /> : text === "Timeline" ? <PeopleAltRoundedIcon /> : <RssFeedIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                    <Divider />
                    <List>
                        {['My Profile', 'Liked By Me', 'Saved For Later', "Bin", "Logout"].map((text, index) => (
                            <ListItem key={index} onClick={() => handleListItem2(index)} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {text === "My Profile" ? <AccountBoxIcon /> : text === "Liked By Me" ? <ThumbUpIcon /> : text === "Saved For Later" ? <BookmarkIcon /> : text === "Saved For Later" ? <AutoDeleteIcon /> : text === 'Bin' ? <DeleteRounded /> : <ExitToAppIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
                )
            }
        </Box>
    );

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
                    <MenuIcon onClick={toggleDrawer(anchor, true)} />
                    <SwipeableDrawer
                        anchor="left"
                        open={state.top}
                        onClose={toggleDrawer('left', false)}
                        onOpen={toggleDrawer('left', true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}