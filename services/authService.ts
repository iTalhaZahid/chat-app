
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

export const resetPassword = async (email: string): Promise<void> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/password/forgot`, { email });
        // console.log("Reset Password Response: ", response.data);
        return response.data;
    }
    catch (error: any) {
        console.log("Login Error: ", error);
        const msg = error?.response?.data?.message || "Login Failed. Please try again.";
        throw new Error(msg);
    }
}
export const verifyOTP = async (email: string, verificationCode: string): Promise<{resetToken: string,success:boolean}> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/password/otp`, { email, verificationCode });
        return response.data;
    }
    catch (error: any) {
        console.log("OTP Verification Error: ", error);
        const msg = error?.response?.data?.message || "OTP Verification Failed. Please try again.";
        throw new Error(msg);
    }
}

export const newPassword = async (resetToken: string, newPassword: string): Promise<{success:boolean}> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/password/reset`, { resetToken, newPassword });
        return response.data;
    }
    catch (error: any) {
        console.log("New Password Error: ", error);
        const msg = error?.response?.data?.message || "New Password Failed. Please try again.";
        throw new Error(msg);
    }
}
export const verifyRegisterOTP = async (email: string, verificationCode: string): Promise<{success:boolean,token:string}> => {
    // Perform API Call to login the user
    try {
        const response = await axios.post(`${API_URL}/auth/verify-email`, { email, verificationCode });
        return response.data;
    }
    catch (error: any) {
        console.log("OTP Verification Error: ", error);
        const msg = error?.response?.data?.message || "OTP Verification Failed. Please try again.";
        throw new Error(msg);
    }
}