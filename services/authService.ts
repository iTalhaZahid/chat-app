
import { API_URL } from "@/constants";
import axios from "axios";

export const login = async (email: string, password: string): Promise<{ token: string }> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        // Assuming the response contains a token
        // return { token: response.data.token };
        return response.data;
    }
    catch (error: any) {
        console.log("Login Error: ", error);
        const msg = error?.response?.data?.message || "Login Failed. Please try again.";
        throw new Error(msg);
    }
}

export const register = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null,
): Promise<{ token: string }> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password, name, avatar });
        // Assuming the response contains a token
        // return { token: response.data.token };
        return response.data;
    }
    catch (error: any) {
        console.log("Registration Error: ", error);
        const msg = error?.response?.data?.message || "Registration Failed. Please try again.";
        throw new Error(msg);
    }
}
