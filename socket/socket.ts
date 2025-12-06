import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
        throw new Error("No token found for socket connection");
    }

    if (!socket) {
        socket = io(API_URL, {
            auth: { token }
        });

        //wait for connection

        await new Promise<void>((resolve, reject) => {
            socket?.on("connect", () => {
                console.log("Socket Connected", socket?.id);
                resolve();
            });

            socket?.on("connect_error", (err) => {
                console.log("Socket connect_error", err);
                reject(err);
            });
        });


        //handle disconnection
        socket.on("disconnect", () => {
            console.log("Socket Disconnected");
        });
    }

    return socket;
}


export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}