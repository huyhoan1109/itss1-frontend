import { ReactNode, FC, useState, createContext, useEffect } from "react";

export const AuthContext = createContext<any>(null)

const initAuthProvider = () => {
    let init_persist = localStorage.getItem("persist")||""
    const [persist, setPersist] = useState(JSON.parse(init_persist) || false);
    const [auth, setAuth] = useState({})
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