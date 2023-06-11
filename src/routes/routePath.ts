export const routePath = {
    home: '/home',
    allTeachers: "/teachers",
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        forgotPassword: '/auth/forgot-password',
    },
    teacher: {
        base: '/teacher',
        allStudents: '/teacher/students'
    },
    user: {
        base: '/user',
        matching: '/matching'
    },
    admin: {
        base: '/admin',
        dashboard: '/admin/dashboard'
    },
    comment: {
        base: '/comment',
        teacher: '/comment/teacher'
    },
    notFound: '*',
}