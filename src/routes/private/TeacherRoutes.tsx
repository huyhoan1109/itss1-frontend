import { Routes, Navigate, Route, RouteProps} from 'react-router-dom'
import { routePath } from '../routePath'
import useAuth from '../../hooks/useAuth'
import LoginPage from '../../pages/auth/Login'
import StudentListPage from '../../pages/teacher/StudentList'

const TeacherRoute = ({children}: any) => {
    const {auth} = useAuth()
    return auth?.user?.role == 'teacher' ? <>children</> : <Navigate to={routePath.auth.login} />
}

const TeacherRoutes = () => {
    const routes = (     
        <Routes>
            <Route 
                path={routePath.teacher.base} 
                element={
                    <TeacherRoute> 
                        <StudentListPage />
                    </TeacherRoute>
                } 
            />
        </Routes>
    )
    return routes
}

export default TeacherRoutes