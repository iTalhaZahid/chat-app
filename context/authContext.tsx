import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signOut: async () => { },
    signUp: async () => { },
    updateToken: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();

    const updateToken = async (token: string) => {
        if (token) {
            setToken(token);
            await AsyncStorage.setItem("token", token);
            const decodedUser = jwtDecode<DecodedTokenProps>(token); //decode token to get user info
            console.log("Decoded User: ", decodedUser);
            setUser(decodedUser.user);
        }
    }

    const signIn = async (email: string, password: string) => {
        // Perform SignIn Logic Here
        const response = await login(email, password);
        await updateToken(response.token);
        router.replace("/(main)/home");
    }

    const signUp= async (email: string, password: string, name: string, avatar?: string | null) => {
        // Perform SignUp Logic Here
        const response = await register(email, password,name, avatar);
        await updateToken(response.token);
        router.replace("/(main)/home");
    }

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/login");
    }

    return (
        <AuthContext.Provider value={{ token, user, signIn, signOut, signUp, updateToken }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth= () => useContext(AuthContext);