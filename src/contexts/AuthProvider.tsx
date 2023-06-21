import { ReactNode, FC, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext<any>(null)

const initAuthProvider = () => {
    const [persist, setPersist] = useLocalStorage('persist', false)
    const [auth, setAuth] = useLocalStorage('auth', "")
    return {
        auth,
        setAuth,
        persist,
        setPersist
    }
}

const AuthProvider: FC<{children:ReactNode}> = ({children}) => {
    const provider = initAuthProvider()
    return <AuthContext.Provider value={provider}>{children}</AuthContext.Provider>
}

export default AuthProvider