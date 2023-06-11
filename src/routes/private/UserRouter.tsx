import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import { routePath } from '../routePath'
import useAuth from '../../hooks/useAuth'
import InfoUserPage from '../../pages/user/InfoUser'

const UserRouter = () => {
    let navigate = useNavigate()
    const {auth} = useAuth()
    if (auth?.user) return navigate(routePath.home)
    else {
        const router = createBrowserRouter([
            {
                path: routePath.user.base,
                element: <InfoUserPage />
            },
        ])

        return <RouterProvider router={router} />
    }
}

export default UserRouter