import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

// components-import
import Header from '../components/Header'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import Profile from '../components/Profile'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

axios.defaults.withCredentials = true;

// creating a context using Context API
const AuthContext = React.createContext();

const Navs = () => {
    const [auth, setAuth] = React.useState(false)
    const [username, setUsername] = React.useState("")
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [userID, setUserID] = React.useState("")

    // func to check for a valid session
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('https://blogify-ayusharma-ctrl.onrender.com/api/user/check-session');
            if (data.status === 200 && data.success) {
                setAuth(true);
                setUsername(data.user.username);
                setName(data.user.name);
                setEmail(data.user.email);
                setUserID(data.user.userId);
            } else {
                setAuth(false)
            }
        } catch (error) {
            if (error.response.status === 400) {
                setAuth(false)
            }
        }
    }

    checkAuth();

    return (
        <AuthContext.Provider value={{ auth, username, name, userID, email, setAuth }} >
            <BrowserRouter>
                <Header />

                <Routes>
                    {/* only authenticated users can access below routes */}
                    <Route path='/' element={<PrivateRoute />} >
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/profile/:userID' element={<Profile />} />
                    </Route>
                    {/* authenticated or logged is users can not access this route */}
                    <Route path='/' element={<RestrictedRoute />} >
                        <Route path='/login' element={<Login />} />
                    </Route>

                </Routes>

            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default Navs
// exporting context
export { AuthContext }