import React, { useEffect } from 'react'
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material'
import { PostAddRounded } from '@mui/icons-material';
import io from 'socket.io-client';

// components-import
import Home from '../utils/Home';
import Explore from '../utils/Explore';
import Timeline from '../utils/Timeline';
import MyBlogs from '../utils/MyBlogs';
import LikedByMe from '../utils/LikedByMe';
import SavedByMe from '../utils/SavedByMe';
import Bin from '../utils/Bin';
import PostBlog from '../utils/PostBlog';


// connection between our server and client, here we give server uri
export const socket = io.connect('https://blogify-ayusharma-ctrl.onrender.com')

const Dashboard = () => {
  const [value, setValue] = React.useState('1');
  const [connectedUsers, setConnectedUsers] = React.useState("");
  const [addBlog, setAddBlog] = React.useState(false);
  // func to switch tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    //custom socket event to receive a message/data from server/backend side
    socket.on("totalusers", (data) => {
      setConnectedUsers(data)
    })
  }, [socket])

  return (
    <div>
      {
        addBlog ? (<PostBlog setAddBlog={setAddBlog}  />) : (<>
          <div style={{ margin: '1rem', marginTop: '4rem' }}>
            <Box sx={{ width: '100%', marginTop: '5rem' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="secondary tabs example"
                >
                  <Tab value="1" label="Home" />
                  <Tab value="2" label="Explore" />
                  <Tab value="3" label="Timeline" />
                  <Tab value="4" label="My Blogs" />
                  <Tab value="5" label="Liked" />
                  <Tab value="6" label="Saved" />
                  <Tab value="7" label="Bin" />
                </Tabs>
              </Box>
              {value === '1' ? <Home connectedUsers={connectedUsers} /> : value === '2' ? <Explore /> : value === '3' ? <Timeline /> : value === '4' ? <MyBlogs /> : value === '5' ? <LikedByMe /> : value === '6' ? <SavedByMe /> : <Bin />}
            </Box>
            <Tooltip onClick={() => setAddBlog(true)} sx={{ position: 'absolute', bottom: 30, right: 30, scale: '1.6', backgroundColor: '#FFA07A' }} color='primary' title="Post A New Blog">
              <IconButton>
                <PostAddRounded />
              </IconButton>
            </Tooltip>
          </div>
        </>)
      }
    </div>
  )
}

export default Dashboard