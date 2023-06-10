import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routePath } from './routePath'

const AdminRouter = () => {
    const router = createBrowserRouter([
        {
            path: routePath.public.home,
            // element: <HomePage />
        },
    ])

    return <RouterProvider router={router} />
}

export default AdminRouter