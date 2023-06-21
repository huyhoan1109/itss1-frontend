import { ReactNode, FC, createContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

export const NotificationContext = createContext<any>(null)

const initNotificationProvider = () => {
    const [notifications, setNotifications] = useState<any>([])
    return {
        notifications,
        setNotifications
    }
}

const NotificationProvider: FC<{children:ReactNode}> = ({children}) => {
    const provider = initNotificationProvider()
    return <NotificationContext.Provider value={provider}>{children}</NotificationContext.Provider>
}

export default NotificationProvider