import React, { useEffect } from 'react'
import { Box, Button, LinearProgress } from '@mui/material';
import axios from 'axios'

// component-imports
import CardForBlog from './CardForBlog';

const Bin = () => {
    const [loading, setLoading] = React.useState(false);
    const [allBlogs, setAllBlogs] = React.useState('');
    const [skip, setSkip] = React.useState(0);
    const [scheduler, setScheduler] = React.useState(0);

    const getAllBlogs = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("https://blogify-ayusharma-ctrl.onrender.com/api/blog/bin")
            // console.log(data)
            if (data.success) {
                setAllBlogs(data.blog)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getAllBlogs()
    }, [skip, scheduler])

    const handleShowMore = () => {
        if (allBlogs) {
            setSkip(prev => prev + allBlogs.length)
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

    return (
        <div style={{ margin: '2rem 1rem' }}>
            <h4>Your Blogs</h4>
            <div>
                {loading ?
                    (<Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>) : (!allBlogs || allBlogs.length === 0) ? (<p>No Data Found.</p>)
                        : allBlogs.map((e, i) => {
                            return <CardForBlog key={i} blogData={e} setScheduler={setScheduler} />
                        })
                }
            </div>
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Button variant='contained' sx={{ margin:'0.4rem 1rem' }} onClick={handlePrevious}> Previous </Button>
                <Button variant='contained' sx={{ margin:'0.4rem 1rem' }} onClick={handleShowMore}> Load More </Button>
            </div>
        </div>
    )
}

export default Bin