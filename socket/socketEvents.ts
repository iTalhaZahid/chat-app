import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("test-event", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("test-event", payload); //callback function
    }
    else{
        socket.emit("test-event", payload); //sending payload as data
    }
}
export const updateProfile = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("updateProfile", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("updateProfile", payload); //callback function
    }
    else{
        socket.emit("updateProfile", payload); //sending payload as data
    }
};

export const getContacts = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("getContacts", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("getContacts", payload); //callback function
    }
    else{
        socket.emit("getContacts", payload); //sending payload as data
    }
};

export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }
    
    if (off) {
        //turn off the event listener
        socket.off("newConversation", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("newConversation", payload); //callback function
    }
    else{
        socket.emit("newConversation", payload); //sending payload as data
    }
};

export const newMessage = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("newMessage", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("newMessage", payload); //callback function
    }
    else{
        socket.emit("newMessage", payload); //sending payload as data
    }
};

export const getConversations = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("getConversations", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("getConversations", payload); //callback function
    }
    else{
        socket.emit("getConversations", payload); //sending payload as data
    }
};
export const getMessages = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket not Connected");
        return;
    }

    if (off) {
        //turn off the event listener
        socket.off("getMessages", payload); //payload is callback 
    }
    else if (typeof payload == "function") {
        socket.on("getMessages", payload); //callback function
    }
    else{
        socket.emit("getMessages", payload); //sending payload as data
    }
};