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