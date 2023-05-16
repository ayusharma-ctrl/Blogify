import { Box, Button, Paper, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../navs/Navs'
import { EditAttributesRounded, PersonRemove, PersonAddAlt1, Verified, LockReset } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ProfileEdit from './ProfileEdit';
import PasswordChange from './PasswordChange';

const ProfileMain = ({ userData, followers, followings, setDataUpdater }) => {
    const { userID } = useContext(AuthContext)
    const [doiFollow, setDoiFollow] = React.useState(false);
    const [doTheyFollow, setDoTheyFollow] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [passwordChange, setPasswordChange] = React.useState(false);

    const fetchFollowOrNot = async () => {
        try {
            const { data } = await axios.get(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/follow/check/${userData?._id}`)
            if (data.success) {
                setDoiFollow(data.iFollowOther)
                setDoTheyFollow(data.otherFollowMe)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFollow = async () => {
        try {
            const { data } = await axios.post(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/follow/${userData?._id}`)
            if (data.success) {
                toast.success(data.message)
                setDataUpdater(prev => prev + 1)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnfollow = async () => {
        try {
            const { data } = await axios.delete(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/follow/${userData?._id}`)
            if (data.success) {
                toast.success(data.message)
                setDataUpdater(prev => prev + 1)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userData && userID !== userData?._id) {
            fetchFollowOrNot()
        }
    }, [userData])

    return (
        <div>
            <ToastContainer />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { mt: 2, width: '100%', } }}>
                <Paper sx={{ padding: 4 }} elevation={3}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span>Verified</span>
                        <Verified color='primary' sx={{ ml: 1 }} />
                    </div>
                    <div style={{ margin: '1.5rem' }}>
                        <Typography sx={{ mb: 1 }}>Name: {userData?.name} </Typography>
                        <Typography>Username: {userData?.username}  </Typography>
                        {userID === userData?._id ? (<Typography>Email: {userData?.email}  </Typography>) : null}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
                            <div className='profileCircles'> {userData?.blogsPosted} </div>
                            <p style={{ fontSize: '0.7rem', fontWeight: '500' }}>Blogs Posted</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
                            <div className='profileCircles'> {userData?.blogsDeleted} </div>
                            <p style={{ fontSize: '0.7rem', fontWeight: '500' }}>Blogs Deleted</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
                            <div className='profileCircles'> {followers} </div>
                            <p style={{ fontSize: '0.7rem', fontWeight: '500' }}>Followers</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
                            <div className='profileCircles'> {followings} </div>
                            <p style={{ fontSize: '0.7rem', fontWeight: '500' }}>Followings</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '3rem' }}>
                        {
                            userID !== userData?._id ? (<Button variant='contained' sx={{ m: 1 }} color={doiFollow ? 'error' : 'primary'} onClick={doiFollow ? handleUnfollow : handleFollow} endIcon={doiFollow ? <PersonRemove /> : <PersonAddAlt1 />} > {doiFollow ? "Unfollow" : "Follow"} </Button>) : null
                        }
                        {
                            userID === userData?._id ? (<Button variant='contained' color='error' sx={{ m: 1 }} onClick={()=>setIsEdit(true)} endIcon={<EditAttributesRounded />}> Edit Profile </Button>) : null
                        }
                        {
                            userID === userData?._id ? (<Button variant='contained' color='error' sx={{ m: 1 }} onClick={()=>setPasswordChange(true)} endIcon={<LockReset />}> Change Password </Button>) : null
                        }
                    </div>
                    {
                        userID !== userData?._id ? (<p>Note: {doTheyFollow ? `${userData?.name} is following you.` : `${userData?.name} is not following you.`}</p>) : null
                    }
                    {
                        isEdit ? <ProfileEdit setIsEdit={setIsEdit} currName={userData?.name} currUsername={userData?.username} setDataUpdater={setDataUpdater} /> : null
                    }
                    {
                        passwordChange ? <PasswordChange setPasswordChange={setPasswordChange} /> : null
                    }

                </Paper>
            </Box>
        </div>
    )
}

export default ProfileMain