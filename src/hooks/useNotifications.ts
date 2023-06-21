import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationProvider";

const useNotifications = () => {
    return useContext(NotificationContext);
}

export default useNotifications;