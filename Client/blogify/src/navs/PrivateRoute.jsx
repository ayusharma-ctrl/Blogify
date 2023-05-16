import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './Navs'

const PrivateRoute = () => {
    // destructuring auth from authcontext
    const {auth} = React.useContext(AuthContext)
    // if auth true, then access the private routes otherwise redirect to login page
    return (
        <div>
            {auth ? (<Outlet />)
                : (<Navigate to='/login' />)
            }
        </div>
    )
}

export default PrivateRoute