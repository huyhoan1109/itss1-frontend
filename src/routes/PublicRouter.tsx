import { RouterProvider, createBrowserRouter, Route } from 'react-router-dom'
import { routePath } from './routePath'

import NotFoundPage from '../pages/public/404'
import LoginPage from '../pages/auth/Login'
import SignUpPage from '../pages/auth/SignUp'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'
import HomePage from '../pages/public/Home'
import SearchTeachersPage from '../pages/public/SearchTeachers'
import InfoTeacherPage from '../pages/public/InfoTeacher'

const PublicRouter = () => {
    const router = createBrowserRouter([
        {
            path: routePath.home,
            element: <HomePage />
        },
        {
            path: routePath.auth.login,
            element: <LoginPage />
        },
        {
            path: routePath.auth.signup,
            element: <SignUpPage />
        },
        {
            path: routePath.auth.forgotPassword,
            element: <ForgotPasswordPage />
        },
        {
            path: routePath.allTeachers,
            element: <SearchTeachersPage />              
        },
        {
            path: routePath.teacher.base + "/:id",
            element: <InfoTeacherPage />              
        },
        {
            path: routePath.notFound,
            element: <NotFoundPage />,
        },
    ])

    return <RouterProvider router={router} />
}

export default PublicRouter