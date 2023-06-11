import { Routes, Navigate, Route } from 'react-router-dom'
import { routePath } from '../routePath'
import useAuth from '../../hooks/useAuth'
import InfoUserPage from '../../pages/user/InfoUser'

const UserRoute = ({children}: any) => {
    const {auth} = useAuth()
    return auth?.user ? <>children</> : <Navigate to={routePath.auth.login} />
}

const UserRoutes = () => {
    const routes = (     
        <Routes>
            <Route 
                path={routePath.user.base} 
                element={
                    <UserRoute> 
                        <InfoUserPage />
                    </UserRoute>
                } 
            />
        </Routes>
    )
    return routes
}

export default UserRoutes