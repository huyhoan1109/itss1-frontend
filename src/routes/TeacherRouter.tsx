import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routePath } from './routePath'

const TeacherRouter = () => {
    const router = createBrowserRouter([
        {
            path: routePath.public.home,
            // element: <HomePage />
        },
    ])

    return <RouterProvider router={router} />
}

export default TeacherRouter