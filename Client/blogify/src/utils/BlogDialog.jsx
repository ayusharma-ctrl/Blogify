import React, { useEffect } from 'react'
import { Bookmark, Close, Comment, DeleteForever, Edit, Restore, ThumbsUpDown } from '@mui/icons-material';
import { AppBar, Button, Dialog, FormControl, IconButton, Input, InputLabel, Slide, Toolbar, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

// component-imports
import CommentContent from './CommentContent';
import EditBlog from './EditBlog';
import { AuthContext } from '../navs/Navs'
import { socket } from '../components/Dashboard'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BlogDialog = ({ setBlogDetails, setScheduler, blogData }) => {

    const { userID, username } = React.useContext(AuthContext)

    const [totalCount, setTotalCount] = React.useState("")
    const [like, setLike] = React.useState(false)
    const [bookmark, setBookmark] = React.useState(false)
    const [comments, setComments] = React.useState('')
    const [commentBox, setCommentBox] = React.useState(false)
    const [commentContent, setCommentContent] = React.useState("")
    const [isEditBlog, setIsEditBlog] = React.useState(false)


    const getTotalCount = async () => {
        try {
            const { data } = await axios.get(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/count/${blogData._id}`)
            if (data.success) {
                const array = [data.like, data.bookmark]
                setTotalCount(array)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkLike = async () => {
        try {
            const { data } = await axios.get(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/like/${blogData._id}`)
            if (data.success) {
                setLike(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkBookmark = async () => {
        try {
            const { data } = await axios.get(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/bookmark/${blogData._id}`)
            if (data.success) {
                setBookmark(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLikeBtn = async () => {
        try {
            const { data } = await axios.post(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/like/${blogData._id}`)
            console.log(data.message)
            if (data.success) {
                setLike(true)
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDislikeBtn = async () => {
        try {
            const { data } = await axios.delete(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/like/${blogData._id}`)
            if (data.success) {
                setLike(false)
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBookmarkBtn = async () => {
        try {
            const { data } = await axios.post(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/bookmark/${blogData._id}`)
            if (data.success) {
                setBookmark(true)
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRemoveBookmarkBtn = async () => {
        try {
            const { data } = await axios.delete(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/bookmark/${blogData._id}`)
            if (data.success) {
                setBookmark(false)
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteBtn = async () => {
        try {
            const { data } = await axios.put(`https://blogify-ayusharma-ctrl.onrender.com/api/blog/bin/move/${blogData._id}`)
            if (data.success) {
                toast.success(data.message)
                setTimeout(() => {
                    setBlogDetails(false)
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

    const handleAddNewComment = () => {
        if (!commentContent || !userID || !blogData?._id) {
            setCommentBox(false)
            toast.error("All fields are required")
            return
        }
        if (commentContent.length > 100) {
            setCommentBox(false)
            toast.error("Comment is too big!")
            return
        }
        socket.emit("newComment", {
            blogID: blogData._id,
            userID: userID,
            username: username,
            comment: commentContent
        })
        socket.emit("blogID", blogData?._id)
        socket.on("history", (data) => {
            setComments(data)
        })
        setCommentContent("");
        setCommentBox(false);
        toast.success("New Comment Added")
    }

    const handleClose = () => {
        setBlogDetails(false)
    };

    useEffect(() => {
        getTotalCount()
        checkLike()
        checkBookmark()
    }, [like, bookmark])

    useEffect(() => {
        socket.emit("blogID", blogData?._id)
        socket.on("history", (data) => {
            setComments(data)
        })
    }, [comments])

    return (
        <div>
            <ToastContainer />
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <Close />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Blog
                        </Typography>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle2" align='right' component="div">
                            Posted By: {blogData?.name}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', marginBottom: '0.5rem' }}>
                    {
                        isEditBlog ? (<EditBlog blogData={blogData} setIsEditBlog={setIsEditBlog} />) : (<>
                            <h2 style={{ margin: '0.6rem' }}> {blogData?.title} </h2>
                            <Typography align='left' margin={4}> {blogData?.intro} </Typography>
                            <Typography align='left' margin={4}> {blogData?.body} </Typography>
                            <Typography align='left' margin={4}> {blogData?.conclusion} </Typography>
                        </>)
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', marginTop: '2rem', marginBottom: '0.5rem', width: '100%' }}>
                        <Typography color={'steelblue'} variant='subtitle2'>
                            Total Likes: {totalCount[0]}
                        </Typography>
                        <Typography color={'steelblue'} variant='subtitle2'>
                            Total Bookmarks: {totalCount[1]}
                        </Typography>
                        {
                            blogData?.isEdited ? (<Typography color={'red'} variant='subtitle2'>
                                Edited
                            </Typography>) : null
                        }
                        <Typography variant='subtitle2'>
                            Posted: {moment(blogData?.createdAt).format('LL')}
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '2rem', marginBottom: '0.5rem' }}>
                        {
                            !blogData?.isDeleted ? (<>
                                <Button variant="contained" color='info' onClick={like ? handleDislikeBtn : handleLikeBtn} sx={{ margin: '1rem', height: '2rem' }} endIcon={<ThumbsUpDown />} >
                                    {like ? "Dislike" : "Like"}
                                </Button>
                                <Button variant="contained" color='warning' onClick={bookmark ? handleRemoveBookmarkBtn : handleBookmarkBtn} sx={{ margin: '1rem', height: '2rem' }} endIcon={<Bookmark />} >
                                    {bookmark ? "Remove Bookmark" : "Bookmark"}
                                </Button>
                                {userID === blogData?.user ? <Button variant="contained" color='primary' onClick={() => setIsEditBlog(true)} sx={{ margin: '1rem', height: '2rem' }} endIcon={<Edit />} >
                                    Edit
                                </Button> : null}
                                {userID === blogData?.user ? <Button variant="contained" color='error' onClick={handleDeleteBtn} sx={{ margin: '1rem', height: '2rem' }} endIcon={<DeleteForever />} >
                                    Delete
                                </Button> : null}
                            </>)
                                : (<Button variant="contained" color='error' endIcon={<Restore />} >
                                    Restore
                                </Button>)
                        }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', marginTop: '1rem', marginBottom: '0.5rem', width: '100%', padding: "1rem 2rem" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
                            <h2>Comments</h2>
                            <Button variant="contained" color='error' onClick={() => setCommentBox(true)} sx={{ margin: '0.5rem 0', height: '1.8rem' }} endIcon={<Comment />}>Add Comment</Button>
                        </div>

                        {
                            commentBox ? (
                                <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: 'center', flexWrap: 'wrap' }}>
                                    <FormControl sx={{ m: 1, width: '25ch' }} size='small' variant="standard">
                                        <InputLabel htmlFor="standard-adornment-comment">Your Comment</InputLabel>
                                        <Input
                                            id="standard-adornment-comment"
                                            value={commentContent}
                                            type='text'
                                            onChange={(e) => setCommentContent(e.target.value)}
                                        />
                                    </FormControl>
                                    <Button onClick={handleAddNewComment} size='small' variant='contained' color='success' sx={{ ml: 1, height: '2rem' }}>Post</Button>
                                    <Button onClick={() => setCommentBox(false)} size='small' variant='contained' color='warning' sx={{ ml: 1, height: '2rem' }}>Cancel</Button>
                                </div>
                            ) : null
                        }

                        {
                            comments && comments.length > 0 ? (
                                comments.map((e, i) => {
                                    return <CommentContent key={i} commentData={e} />
                                })
                            ) : "No Comments Yet"
                        }
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default BlogDialog