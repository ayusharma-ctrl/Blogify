import { AccountCircle, Close } from '@mui/icons-material'
import { AppBar, Button, Dialog, FormControl, IconButton, Input, InputAdornment, InputLabel, Slide, Toolbar, Typography } from '@mui/material'
import React from 'react'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const VerifyResetDialog = ({ setReset, setVerify, reset, verify, handleVerifyBtn, handleResetBtn, verifyTitle, resetTitle, resetBtnText, verifyBtnText, setUsername }) => {

    const handleClose = () => {
        if (reset) {
            setReset(false);
            return
        } else {
            setVerify(false)
        }
    };

    return (
        <div>
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
                            {verify ? "Verify Account" : "Reset Password"}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', marginBottom: '0.5rem' }}>
                    <h2 style={{margin:'0.6rem'}}> {reset ? resetTitle : verifyTitle} </h2>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-username">Email or Username</InputLabel>
                        <Input
                            id="standard-adornment-username"
                            type='text'
                            onChange={(e) => setUsername(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton>
                                        <AccountCircle />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <div style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                        <Button variant="contained" onClick={verify ? handleVerifyBtn : handleResetBtn}>
                            {verify ? verifyBtnText : resetBtnText}
                        </Button>
                    </div>
                </div>

            </Dialog>
        </div>
    )
}

export default VerifyResetDialog