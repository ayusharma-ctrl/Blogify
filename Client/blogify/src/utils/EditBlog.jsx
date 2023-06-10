import { Button, TextField } from '@mui/material'
import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const EditBlog = ({ blogData, setIsEditBlog }) => {

    const [title, setTitle] = React.useState(blogData?.title)
    const [intro, setIntro] = React.useState(blogData?.intro)
    const [body, setBody] = React.useState(blogData?.body)
    const [conclusion, setConclusion] = React.useState(blogData?.conclusion)

    const handleBlogEditBtn = async () => {
        if(!title || !intro || !body || !conclusion){
            toast.error("All Fields are required!")
            return
        }
        const length = intro.length + body.length + conclusion.length
        if(length<500 || length >2000){
            toast.error("Blog should have characters between 500 and 2000.")
            return
        }

        try {
            const { data } = await axios.post(`/api/blog/edit/${blogData?._id}`,
                { title: title, intro: intro, body: body, conclusion: conclusion },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if(data.success){
                toast.success("Blog is Edited Successfully!")
                toast.success("New changes will be visible within a minute!")
            } else{
                toast.error(data?.message)
            }
            setIsEditBlog(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: 'center', flexWrap: 'wrap' }}>
            Edit Blog
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
            </div>
            <Button onClick={() => setIsEditBlog(false)} size='small' variant='contained' color='warning' sx={{ ml: 1, height: '2rem' }}>Cancel</Button>
            <Button onClick={handleBlogEditBtn} size='small' variant='contained' color='success' sx={{ ml: 1, height: '2rem' }}>Save</Button>
        </div>
    )
}

export default EditBlog