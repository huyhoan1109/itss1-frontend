import { routePath } from "../routes/routePath"
const appLogout = (timer:any) => {
    setTimeout(() => {
        localStorage.removeItem('auth')
        window.location.pathname = routePath.auth.login
    }, timer)
}

export default appLogout