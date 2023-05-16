import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './Navs'

const RestrictedRoute = () => {
    // destructuring auth from authcontext
    const {auth} = React.useContext(AuthContext)
    // if auth false, then access the restricted routes otherwise redirect to private routes i.e., dashboard
    return (
        <div>
            {auth ? (<Navigate to='/dashboard' />)
                : (<Outlet />)
            }
        </div>
    )
}

export default RestrictedRoute