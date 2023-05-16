import { Button, Paper } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../navs/Navs';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const UserCard = ({ info, setDataUpdater, setValue }) => {

  const [doiFollow, setDoiFollow] = React.useState(false);

  const { userID } = useContext(AuthContext)

  const navigate = useNavigate()

  const fetchFollowOrNot = async () => {
    try {
      const { data } = await axios.get(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/follow/check/${info?._id}`)
      if (data.success) {
        setDoiFollow(data.iFollowOther)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleProfile = () => {
    navigate(`/profile/${info?._id}`)
    setDataUpdater(prev=>prev+1)
    setValue('1')
  }

  const handleFollowUnfollowBtn = () => {
    toast.info("Click on profile to follow or unfollow")
  } 

  useEffect(() => {
    fetchFollowOrNot()
  }, [info])

  return (
    <div>
      <ToastContainer/>
      <Paper elevation={2} sx={{ padding: '0.7rem 2rem', borderRadius: '20px', marginBottom: '1rem' }} >
        {info?.name}
        {
          userID !== info?._id ? (<Button variant='contained' size='small' onClick={handleFollowUnfollowBtn} sx={{ float: 'right', fontSize: '0.7rem', ml: 1 }}> {doiFollow ? "Unfollow" : "Follow"} </Button>) : null
        }
        <Button variant='contained' size='small' color='warning' onClick={handleProfile} sx={{ float: 'right', fontSize: '0.7rem' }}> Profile </Button>
      </Paper>
    </div>
  )
}

export default UserCard