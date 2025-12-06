import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';
import { connectSocket } from "@/socket/socket";

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

    useEffect(() => {
        loadToken();
    }, [])

    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<DecodedTokenProps>(storedToken); //decode token to get user info

                if (decodedUser.exp && decodedUser.exp < Date.now() / 1000) {
                    // Token has expired
                    await AsyncStorage.removeItem("token");
                    goToWelcomePage();
                    return;
                }

                // 🔗 connect socket here (token already in AsyncStorage)
                try {
                    await connectSocket();
                } catch (err) {
                    console.log("Socket connection failed on loadToken:", err);
                }

                console.log("Decoded User: ", decodedUser);
                setToken(storedToken);
                setUser(decodedUser.user);
                goToHomePage();
            } catch (error: any) {
                goToWelcomePage();
                console.log("Token Decoding Error: ", error);
            }
        }
        else {
            goToWelcomePage();
        }
    }

    const goToWelcomePage = () => {
        setTimeout(() => {
            router.replace("/(auth)/welcome");

        }, 1500);
    }
    const goToHomePage = () => {
        setTimeout(() => {
            router.replace("/(main)/home");
        }, 1500);
    }

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

    const signUp = async (email: string, password: string, name: string, avatar?: string | null) => {
        // Perform SignUp Logic Here
        const response = await register(email, password, name, avatar);
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

export const useAuth = () => useContext(AuthContext);