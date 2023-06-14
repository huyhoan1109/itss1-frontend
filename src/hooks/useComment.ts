import { useContext, useDebugValue } from "react";
import { CommentContext } from "../contexts/CommentProvider";

const useComment = () => {
    const {comment} = useContext(CommentContext);
    return useContext(CommentContext);
}

export default useComment;