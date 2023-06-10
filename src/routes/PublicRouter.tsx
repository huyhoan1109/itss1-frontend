import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routePath } from './routePath'

import NotFoundPage from '../pages/public/404'
import LoginPage from '../pages/auth/Login'
import SignUpPage from '../pages/auth/SignUp'
import HomePage from '../pages/public/Home'
import SearchTeachersPage from '../pages/public/SearchTeachers'
import InfoTeacherPage from '../pages/public/InfoTeacher'

const PublicRouter = () => {
    const router = createBrowserRouter([
        {
            path: routePath.public.home,
            element: <HomePage />
        },
        {
            path: routePath.public.login,
            element: <LoginPage />
        },
        {
            path: routePath.public.signup,
            element: <SignUpPage />
        },
        {
            path: routePath.public.baseTeacher,
            element: <SearchTeachersPage />,
        },
        {
            path: routePath.public.baseTeacher + '/:id',
            element: <InfoTeacherPage />
        },
        {
            path: routePath.public.notFound,
            element: <NotFoundPage />,
        },
    ])

    return <RouterProvider router={router} />
}

export default PublicRouter