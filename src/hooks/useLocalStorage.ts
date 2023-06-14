import {useState, useEffect} from "react"
import useAuth from "./useAuth"

const useLocalStorage = (key:string, initValue:any) => {
    const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)||"{}")||initValue)
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}

export default useLocalStorage