'use client'
import io from "socket.io-client";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth";

export const useSocket = (serverPath) => {
    const [socket, setSocket] = useState(null);
    const [online, setOnline] = useState(false);

    const {userAuth} = useContext(AuthContext)
    
    const connectarSocket = useCallback(() => {

        const socketTemp = io.connect(serverPath, {
            transports: ['websocket'], autoConnect: true, forceNew: true, query: {
                'id': userAuth?.auth?.uid
            }
        })
        setSocket(socketTemp)
    }, [serverPath, userAuth])

    const desconectarSocket = useCallback(() => {
        socket?.disconnect()
    }, [socket])

    useEffect(() => {
        setOnline(socket?.connected)
    }, [socket])

    const handleConnect = () => {
        setOnline(true);
    };

    const handleDisconnect = () => {
        setOnline(false);
    };

    useEffect(() => {
        socket?.on("connect", handleConnect);
    }, [socket])

    useEffect(() => {
        socket?.off("disconnect", handleDisconnect);
    }, [socket])

    return {
        socket,
        online,
        connectarSocket,
        desconectarSocket
    };
};
