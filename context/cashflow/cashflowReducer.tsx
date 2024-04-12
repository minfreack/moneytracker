export const types = {
    income: 'income',
    allTransactions: 'allTransactions',
}

type Transaction = {
    name?: string;
    amount: string;
    date: number;
    type: string;
    category?: string;
}

type State = {
    transactions: Transaction[], 
    income: number,
    expenses: number
    records: any
}

export const cashflowReducer = (state : State, action: any) => {    
    switch (action.type) {
        case types.income:
            return {
                ...state,
                ...action.payload
            }
        case types.allTransactions:
            return {
                ...state,
                transactions: [...action.payload.transactions],
                records: {...action.payload.records}
            }
        default:
            return state;
    }
}