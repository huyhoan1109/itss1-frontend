import { ReactNode, FC, useState, createContext } from "react";

export const CommentContext = createContext<any>(null)

const initCommentProvider = () => {
    const [isPopUp, setIsPopUp] = useState(false)
    return {
        isPopUp,
        setIsPopUp
    }
}

const CommentProvider: FC<{children:ReactNode}> = ({children}) => {
    const provider = initCommentProvider()
    return <CommentContext.Provider value={provider}>{children}</CommentContext.Provider>
}

export default CommentProvider