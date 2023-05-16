import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import UserCard from '../utils/UserCard'

const ProfileFollower = ({ followers, followings, value, setDataUpdater, setValue }) => {

  const [data, setData] = React.useState("")

  useEffect(() => {
    if (value === '3') {
      setData(followers)
    } else {
      setData(followings)
    }
  }, [value, followers, followings])

  return (
    <div style={{ margin: '2rem' }}>

      <Typography gutterBottom variant='h6'>{value === '3' ? " Followers" : "Followings"}</Typography>
      {
        data && data.length>0 ? data.map((e, i) => {
          return <UserCard key={i} info={e} setDataUpdater={setDataUpdater} setValue={setValue} />
        }) : "No User Found"
      }

    </div>
  )
}

export default ProfileFollower