import axios from "axios";
import { BASE_URL } from "./constant";
// import { JwtPayload } from "jsonwebtoken";
export const BASE_TEACHER = BASE_URL + '/teacher'

export const searchTeacher = async (searchParams: string | URLSearchParams) => {
    const res = await axios.get(`${BASE_TEACHER}?${searchParams}`);
    return res.data;
};