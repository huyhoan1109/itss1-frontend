import { Routes, Route } from 'react-router-dom'
import { routePath } from './routePath'

import HomePage from '../pages/public/Home'
import LoginPage from '../pages/auth/Login'
import SignUpPage from '../pages/auth/SignUp'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'
import SearchTeachersPage from '../pages/public/SearchTeachers'
import InfoTeacherPage from '../pages/public/InfoTeacher'
import NotFoundPage from '../pages/public/404'

const PublicRoutes = () => {
    const routes = (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path={routePath.home} element={<HomePage />} />
            <Route path={routePath.auth.login} element={<LoginPage />} />
            <Route path={routePath.auth.signup} element={<SignUpPage />} />
            <Route path={routePath.auth.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={routePath.allTeachers} element={<SearchTeachersPage />} />
            <Route path={routePath.teacher.base+'/:id'} element={<InfoTeacherPage />} />
            <Route path={routePath.notFound} element={<NotFoundPage />} />
        </Routes>
    )
    return routes
}

export default PublicRoutes