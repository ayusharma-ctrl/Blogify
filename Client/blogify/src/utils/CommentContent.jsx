import React from 'react'
import { Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const CommentContent = ({ commentData }) => {

    const navigate = useNavigate()
    const handleRedirect = () => {
        navigate(`/profile/${commentData.user}`)
    }

    return (
        <div style={{ width: "100%" }}>
            <Paper elevation={2} sx={{ margin: '0.4rem', padding: '10px', height: 'fit-content', backgroundColor: 'thistle', borderRadius:'10px' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p onClick={handleRedirect} style={{ fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', color:'dodgerblue' }}>{commentData?.username}</p>
                    <p style={{ fontSize: '0.7rem' }}>{moment(commentData?.time).format('LL')}</p>
                </div>
                <p style={{ fontSize: '0.9rem', wordWrap: 'break-word' }}>{commentData?.comment}</p>
            </Paper>
        </div>
    )
}

export default CommentContent