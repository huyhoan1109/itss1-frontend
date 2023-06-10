import { ReactNode, FC, useState, createContext } from "react";

export const AuthContext = createContext<any>(null)

const initAuthProvider = () => {
    const [auth, setAuth] = useState({})
    let init_persist = JSON.parse(localStorage.getItem("persist")||"")
    const [persist, setPersist] = useState(init_persist || false);
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