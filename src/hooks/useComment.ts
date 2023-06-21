import { useContext, useDebugValue } from "react";
import { CommentContext } from "../contexts/CommentProvider";

const useComment = () => {
    return useContext(CommentContext);
}

export default useComment;