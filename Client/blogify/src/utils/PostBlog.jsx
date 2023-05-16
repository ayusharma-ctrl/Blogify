import { Button, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

const PostBlog = ({ setAddBlog }) => {
    const [title, setTitle] = React.useState("")
    const [intro, setIntro] = React.useState("")
    const [body, setBody] = React.useState("")
    const [conclusion, setConclusion] = React.useState("")
    const [hashcode, setHashCode] = React.useState("")
    const [hashtags, setHashtags] = React.useState([])
    const [count, setCount] = React.useState(0)

    const handleHashSelect = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            if (hashcode && hashcode.length > 2 && hashcode.charAt(0) === '#' && hashtags.length < 5) {
                console.log(hashtags)
                hashtags.push(hashcode)
                setHashCode("")
                console.log(hashtags)
            }
        }
    }

    const handleDeselectHash = (hash) => {
        const array = hashtags.filter((e) => e !== hash)
        setHashtags(array)
    }

    const handleAddNewBlog = async () => {
        if (!title || !intro || !body || !conclusion) {
            toast.error("All Fields are required!")
            return
        }
        const length = intro.length + body.length + conclusion.length
        if (length < 500 || length > 2000) {
            toast.error("Blog should have characters between 500 and 2000.")
            return
        }
        try {
            const { data } = await axios.post("https://blogify-ayusharma-ctrl.onrender.com/api/blog/post",
                { title: title, intro: intro, body: body, conclusion: conclusion, hashtags: hashtags },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (data.success) {
                toast.success("Blog is Posted Successfully!")
                setTimeout(() => {
                    setAddBlog(false)
                }, 1000)
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        setCount(intro.length + body.length + conclusion.length)
    }, [intro, body, conclusion])

    return (
        <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: 'center', flexWrap: 'wrap', marginTop: '5rem' }}>
            <ToastContainer />
            <h4>Write a Blog</h4>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Blog Title"
                    multiline
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxRows={1}
                    size='small'
                    color="secondary"
                    sx={{ margin: '1rem 2rem', width: '90%' }}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Intro"
                    multiline
                    rows={4}
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    size='small'
                    sx={{ margin: '1rem 2rem', width: '90%' }}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Body"
                    multiline
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    size='small'
                    sx={{ margin: '1rem 2rem', width: '90%' }}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Conclusion"
                    multiline
                    rows={4}
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    size='small'
                    sx={{ margin: '1rem 2rem', width: '90%' }}
                />
                 <div style={{width:'100%'}}>
                    <h5 style={{float:'right', margin:'0.5rem 3.5rem'}}>Characters: {count}</h5>
                </div>
                <TextField
                    id="outlined-multiline-static"
                    label="Select A Hashtag - Press Enter or Space key to make your selection"
                    value={hashcode}
                    onChange={(e) => setHashCode(e.target.value)}
                    onKeyDown={handleHashSelect}
                    size='small'
                    sx={{ margin: '1rem 2rem', width: '90%' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {hashtags.length > 0 ?
                        (hashtags.map((e, i) => <span className='hashtag' onClick={(e) => handleDeselectHash(e.target.textContent)} style={{ margin: '10px' }} key={i}>{e}</span>)) : (<p>No Hashtag selected!</p>)
                    }
                </div>
                <div>
                    {
                        hashtags.length === 5 ? "Alert: You're not allowed to select more than 5 hashtags!" : "Note: You can select upto 5 hashtags!"
                    }
                </div>
            </div>
            <div style={{ marginBottom: "4rem", marginTop: '1rem' }}>
                <Button onClick={() => setAddBlog(false)} size='small' variant='contained' color='warning' sx={{ ml: 1, height: '2rem' }}>Cancel</Button>
                <Button onClick={handleAddNewBlog} size='small' variant='contained' color='success' sx={{ ml: 1, height: '2rem' }}>Save</Button>
            </div>
        </div>
    )
}

export default PostBlog