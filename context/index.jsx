'use client'
import React, {useEffect, createContext, useContext} from 'react';
import { useSocket } from '@/hooks/useSocket'
import { AuthContext } from '@/context/auth';
import { CashflowContext } from '@/context/cashflow';
import { types } from './cashflow/cashflowReducer';



export const SocketContext = createContext();

const url = process.env.NEXT_PUBLIC_API_URL

export const SocketProvider = ({ children }) => {

    const {socket, online, connectarSocket, desconectarSocket} = useSocket(url);

    const { userAuth } = useContext(AuthContext);

    const { dispatch } = useContext(CashflowContext)

    useEffect(() => {
        if(userAuth?.auth?.auth){
            connectarSocket();
        }
    },[userAuth, connectarSocket])

    useEffect(() => {
        if(!userAuth?.auth?.auth){
            desconectarSocket();
        }
    },[userAuth, desconectarSocket])

    useEffect(() => {
        socket?.on('cashflow', data => {
            dispatch({
                type: types.income,
                payload: data?.data
            })
        })
    }, [socket, dispatch]);

    useEffect(() => {
        socket?.on('all-transactions', data => {
            dispatch({
                type: types.allTransactions,
                payload: data?.data
            })
        })
    }, [socket, dispatch]);

    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}