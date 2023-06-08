import axios from "axios";
import { BASE_URL } from "./constant";
import { JwtPayload } from "jsonwebtoken";

export const validateUser = async (token: string | JwtPayload) => {
    try {
        const res = await axios.get(`${BASE_URL}/users/login`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};