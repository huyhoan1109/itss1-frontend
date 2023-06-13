import { Routes, Route, Navigate } from 'react-router-dom'
import { routePath } from './routePath'

import HomePage from '../pages/public/Home'
import LoginPage from '../pages/auth/Login'
import SignUpPage from '../pages/auth/SignUp'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'
import SearchTeachersPage from '../pages/public/SearchTeachers'
import InfoTeacherPage from '../pages/public/InfoTeacher'
import NotFoundPage from '../pages/public/404'
import useAuth from '../hooks/useAuth'
import StudentListPage from '../pages/teacher/StudentList'
import InfoUserPage from '../pages/user/InfoUser'
import DashboardPage from '../pages/admin/Dashboard'


const UserRoute = ({children}: any) => {
    const {auth} = useAuth()
    return auth?.user ? <>{children}</> : <Navigate to={routePath.auth.login} />
}

const TeacherRoute = ({children}: any) => {
    const {auth} = useAuth()
    console.log(auth?.user?.role)
    return auth?.user?.role == 'teacher' ? <>{children}</> : <Navigate to={routePath.auth.login} />
}

const AdminRoute = ({children}: any) => {
    const {auth} = useAuth()
    return auth?.user?.role == 'admin' ? <>{children}</> : <Navigate to={routePath.auth.login} />
}

const AppRoutes = () => {
    const routes = (
        <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path={routePath.home} element={<HomePage />} />
            <Route path={routePath.auth.login} element={<LoginPage />} />
            <Route path={routePath.auth.signup} element={<SignUpPage />} />
            <Route path={routePath.auth.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={routePath.allTeachers} element={<SearchTeachersPage />} />
            <Route path={routePath.teacher.view(":id")} element={<InfoTeacherPage />} />

            {/* { admin } */}
            <Route 
                path={routePath.admin.dashboard} 
                element={
                    <AdminRoute>
                        <DashboardPage />
                    </AdminRoute>
                }
            />

            {/* { teacher } */}
            <Route 
                path={routePath.teacher.allStudents} 
                element={
                    <TeacherRoute>
                        <StudentListPage />
                    </TeacherRoute>
                }
            />
            
            {/* { user } */}
            <Route 
                path={routePath.user.base} 
                element={
                    <UserRoute>
                        <InfoUserPage />
                    </UserRoute>
                }
            />

            <Route path={routePath.notFound} element={<NotFoundPage />} />
        </Routes>
    )

    return routes
}

export default AppRoutes