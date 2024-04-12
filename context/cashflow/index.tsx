'use client'
import React, { useReducer, createContext, Dispatch } from 'react';
import { cashflowReducer } from './cashflowReducer';

type Transaction = {
    name?: string;
    amount: number;
    date: number;
    type: string;
    category?: string;
};

type State = {
    records: any;
    lastTransactions: Transaction[];
    transactions: Transaction[];
    income: number;
    expenses: number;
    total: number
};

type Action = { type: string; payload: any };

const initialState: State = {
    records: {},
    lastTransactions: [],
    transactions: [],
    income: 0,
    expenses: 0,
    total: 0
};

export const CashflowContext = createContext<{
    cashflow: State;
    dispatch: Dispatch<Action>;
}>({ cashflow: initialState, dispatch: () => {} });

export const CashflowProvider = ({ children }: { children: React.ReactNode }) => {
    const [cashflow, dispatch] = useReducer(cashflowReducer, initialState);

    return (
        <CashflowContext.Provider value={{ cashflow, dispatch }}>
            {children}
        </CashflowContext.Provider>
    );
};
