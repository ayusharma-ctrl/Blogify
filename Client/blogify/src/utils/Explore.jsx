import React, { useEffect } from 'react'
import { Box, Button, LinearProgress } from '@mui/material'
import axios from 'axios';

// component-imports
import CardForBlog from './CardForBlog'

const Explore = () => {
    const [hashtags, setHashtags] = React.useState('');
    const [hashcode, setHashcode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [allBlogs, setAllBlogs] = React.useState('');
    const [skip, setSkip] = React.useState(0);
    const [scheduler, setScheduler] = React.useState(0);
    const [switchTrigger, setSwitchTrigger] = React.useState(false)

    const getHashtags = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get("/api/blog/hashtag/trending")
            // console.log(data)
            if (data.success) {
                // console.log(data.hashtag)
                setHashtags(data.hashtag)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const getAllBlogs = async () => {
        try {
            console.log(skip)
            setLoading(true)
            const { data } = await axios.get(`/api/blog/all?skip=${skip}`)
            // console.log(data)
            if (data.success) {
                console.log(data.blogs)
                setAllBlogs(data.blogs)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleHashcode = async (hash) => {
        setHashcode(hash)
        setSwitchTrigger(true)
        setSkip(0)
    }

    const filterByHashtag = async () => {
        try {
            setLoading(true)
            const hash = hashcode.slice(1)
            const { data } = await axios.get(`/api/blog/hashtag?skip=${skip}&hash=${hash}`)
            if (data.success) {
                console.log(data.blog)
                setAllBlogs(data.blog)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleReset = () => {
        setHashcode('')
        setSkip(0)
        setSwitchTrigger(false)
    }

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

    useEffect(() => {
        if (switchTrigger) {
            filterByHashtag()
        } else {
            getAllBlogs()
            getHashtags()
        }
    }, [skip, scheduler, switchTrigger])

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                    <h4>Trending Hashtags</h4>
                    <p style={{ fontSize: '0.7rem' }}>Note: #tag(3) - which means &quot;#tag&quot; has been used 3 times in the 10 most recent posts. Do not forget to click on Reset Button before selecting a new hashtag.*</p>
                </div>
                <Button onClick={handleReset} variant='contained' color='error' size='small'> Reset </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', margin: '1.5rem 1rem' }}>
                {loading ?
                    (<Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>) : (!hashtags || hashtags.length === 0) ? (<p>No Data Found.</p>)
                        : hashtags.map((e, i) => {
                            return <h5 key={i} className={hashcode === e._id ? 'hashtag' : 'hashtag1'} onClick={() => handleHashcode(e._id)} style={{ color: 'slateblue', margin: '10px' }}> {e._id}({e.count}) </h5>
                        })
                }
            </div>
            <div>
                <h4>Blogs Posted By Everyone</h4>
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

export default Explore