import {useState, useEffect} from "react"
import useAuth from "./useAuth"

const useLocalStorage = (key:string, initValue:any) => {
    let lc:any = localStorage.getItem(key)
    if (lc == null) lc = initValue
    else lc = JSON.parse(lc)
    const [value, setValue] = useState(lc)
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}

export default useLocalStorage