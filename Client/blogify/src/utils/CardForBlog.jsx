import React, { useContext } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// component-imports
import BlogDialog from './BlogDialog';
import { AuthContext } from '../navs/Navs';


const CardForBlog = ({ blogData, setScheduler }) => {
  const [blogDetails, setBlogDetails] = React.useState(false);

  const { userID } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleProfileView = () => {
    navigate(`/profile/${blogData?.user}`)
  }

  const handleRecover = async () => {
    try {
      const { data } = await axios.put(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/bin/recover/${blogData?._id}`)
      if (data.success) {
        toast.success(data.message)
        setTimeout(() => {
          setScheduler(prev => prev + 1)
        }, 2000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error: Check console for more info")
    }
  }

  return (
    <>
      {blogDetails ? (<BlogDialog setBlogDetails={setBlogDetails} blogData={blogData} setScheduler={setScheduler} />) : (
        <div style={{ margin: '1rem' }}>
          <Card sx={{ Width: '100%', backgroundColor: 'lightsteelblue' }}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography gutterBottom variant="h7" component="div">
                    {blogData.name}
                  </Typography>
                  <Button size='small' variant='outlined' color='error' onClick={handleProfileView} sx={{ ml: 2, height: '1.2rem' }}> Profile </Button>
                </div>
                <Typography gutterBottom variant="h7" component="div">
                  Posted: {moment(blogData.createdAt).format('LL')}
                </Typography>
              </div>
              <Typography variant="body2" color="text.secondary">
                {blogData.title}
              </Typography>
            </CardContent>
            <CardActions>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                <div>
                  <Button size="small" variant='contained' color='info' sx={{ height: '1.4rem' }} onClick={() => setBlogDetails(true)} >View</Button>
                  {
                    userID === blogData?.user && blogData?.isDeleted ? (<Button size="small" variant='contained' color='error' sx={{ height: '1.4rem', margin: '0.3rem' }} onClick={handleRecover} >Recover</Button>) : null
                  }
                </div>
                <Typography variant='caption' align='right'> {blogData.isEdited ? "Edited" : ""} </Typography>
              </div>
            </CardActions>
          </Card>
        </div>)
      }
    </>
  )
}

export default CardForBlog