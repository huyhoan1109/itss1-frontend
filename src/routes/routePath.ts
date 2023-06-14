function path(root: string, sublink: string) {
    return `${root}/${sublink}`;
}

export const routePath = {
    home: '/home',
    allTeachers: "/teachers",
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        forgotPassword: '/auth/forgot-password',
    },
    teacher: {
        view: (id: string) => path('/teacher/info',`${id}`),
        allStudents: '/teacher/your/students'
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
        view: (id:string) => path('/comment',`${id}`),
        teacher: (id: string) => path('/comment/teacher', `${id}`)
    },
    notFound: '*',
}