import React, { useEffect } from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// components-import
import ProfileMain from '../utils/ProfileMain';
import ProfileBlog from '../utils/ProfileBlog'
import ProfileFollower from '../utils/ProfileFollower'


const Profile = () => {
    const [value, setValue] = React.useState('1');
    const [userData, setUserData] = React.useState("");
    const [followings, setFollowings] = React.useState("");
    const [followers, setFollowers] = React.useState("");
    const [dataUpdater, setDataUpdater] = React.useState(0);
    // read userID from url
    const { userID } = useParams();
    
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`/api/user/profile/${userID}`)
            if (data.success) {
                setUserData(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFollowers = async () => {
        try {
            const { data } = await axios.get(`/api/blog/followers/${userID}`)
            if (data.success) {
                setFollowers(data.followers)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFollowings = async () => {
        try {
            const { data } = await axios.get(`/api/blog/followings/${userID}`)
            if (data.success) {
                setFollowings(data.followings)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetchUserData();
        fetchFollowers();
        fetchFollowings();
    }, [dataUpdater])

    return (
        <div style={{ margin: '1rem', marginTop: '5rem' }}>
            <Box sx={{ width: '100%' }}>
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
                        <Tab value="1" label="Profile" />
                        <Tab value="2" label="Blogs" />
                        <Tab value="3" label="Followers" />
                        <Tab value="4" label="Followings" />
                    </Tabs>
                </Box>
                {value === '1' ? <ProfileMain userData={userData} followings={followings.length} followers={followers.length} setDataUpdater={setDataUpdater} />
                    : value === '2' ? <ProfileBlog userData={userData} /> : <ProfileFollower followers={followers} followings={followings} value={value} setDataUpdater={setDataUpdater} setValue={setValue} />}
            </Box>
        </div>
    )
}

export default Profile