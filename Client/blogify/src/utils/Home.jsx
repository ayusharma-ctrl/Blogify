import { Typography } from '@mui/material'
import React from 'react'

const Home = ({ connectedUsers }) => {
  return (
    <div style={{ margin: '2rem' }}>
      <Typography color={'green'} sx={{mb:2}}>
        Online Users (Excluding You): {connectedUsers} 
      </Typography>
      <Typography>
        Welcome!
      </Typography>
    </div>
  )
}

export default Home