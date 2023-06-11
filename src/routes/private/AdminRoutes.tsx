import { Route, Routes, Navigate, RouteObject, RouteMatch } from 'react-router-dom'
import { routePath } from '../routePath'
import DashboardPage from '../../pages/admin/Dashboard'
import { ReactNode } from 'react'
import useAuth from '../../hooks/useAuth'
import LoginPage from '../../pages/auth/Login'

const AdminRoute = ({children}: any) => {
    const {auth} = useAuth()
    return auth?.user?.role == 'admin' ? <>children</> : <Navigate to={routePath.auth.login} />
}

const AdminRoutes = () => {
    const routes = (     
        <Routes>
            <Route 
                path={routePath.admin.dashboard} 
                element={
                    <AdminRoute>
                        <DashboardPage />
                    </AdminRoute>
                } 
            />
        </Routes>
    )
    return routes
}

export default AdminRoutes