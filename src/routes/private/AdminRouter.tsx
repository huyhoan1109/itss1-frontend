import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import { routePath } from '../routePath'
import useAuth from '../../hooks/useAuth'
import DashboardPage from '../../pages/admin/Dashboard'

const AdminRouter = () => {
    let navigate = useNavigate()
    const {auth} = useAuth()
    if (auth?.role != 'admin') return navigate(routePath.home)
    else {
        const router = createBrowserRouter([
            {
                path: routePath.admin.dashboard,
                element: <DashboardPage />
            },
        ])

        return <RouterProvider router={router} />
    }
}

export default AdminRouter