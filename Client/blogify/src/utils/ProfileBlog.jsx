import axios from 'axios'
import React, { useEffect } from 'react'
import { Button } from '@mui/material';

// component-imports
import CardForBlog from './CardForBlog';

const ProfileBlog = ({ userData }) => {

  const [blogsData, setBlogsData] = React.useState("")
  const [skip, setSkip] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [scheduler, setScheduler] = React.useState(0);

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/blog/all/${userData._id}?skip=${skip}`)
      if (data.success) {
        setBlogsData(data.blogs)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleShowMore = () => {
    if (blogsData) {
      setSkip(prev => prev + blogsData.length)
    }
  }

  const handlePrevious = () => {
    if (skip >= 5) {
      setSkip(prev => prev - 5)
    }
    else {
      setSkip(0)
    }
  }

  useEffect(() => {
    if(userData){
      fetchBlogs()
    }
  }, [skip, scheduler])

  return (
    <div style={{ marginTop: '2rem' }}>
      Blogs Posted By {userData?.name}
      <div>
        {loading ? (<p>Loading...</p>) : (!blogsData || blogsData.length === 0) ? (<p>No Data Found.</p>)
          : blogsData.map((e, i) => {
            return <CardForBlog key={i} blogData={e} setScheduler={setScheduler} />
          })
        }
      </div>
      <div>
        <Button variant='contained' sx={{ ml: 2 }} onClick={handlePrevious}> Previous </Button>
        <Button variant='contained' sx={{ ml: 4 }} onClick={handleShowMore}> Load More </Button>
      </div>
    </div>
  )
}

export default ProfileBlog