import dayjs from "dayjs";

type Transaction = {
    name?: string;
    amount: number;
    date: number;
    type: string;
    category?: string;
};

type GroupedTransactions = {
    date?: number;
    income: number;
    expense: number;
    total?: number;
    transactions: Transaction[];
};  

type GroupedCategories = {
    category?: string;
    income: number;
    expense: number;
    total?: number;
    transactions: Transaction[];
    color: string
};

const colorsAvailable = [
    'blue',
    'violet',
    'green', 
    'yellow',
    'red',
    'purple',
    'orange',
    'indigo',
    'teal',
    'pink',
    'cyan',
    'amber',
    'lime',
    'gray',
];


const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groupedTransactions : GroupedTransactions[] = [];
    // Iterar sobre las transacciones
    transactions?.sort((a, b) => a.date - b.date).forEach(transaction => {
        // Obtener la fecha de la transacción (en milisegundos)
        const transactionDate = transaction.date;

        // Convertir la fecha a un formato legible (por ejemplo, YYYY-MM-DD)
        const formattedDate = dayjs(transactionDate).valueOf();

        // Verificar si ya existe un grupo para esta fecha
        if (!groupedTransactions[formattedDate]) {
            // Si no existe, crear un nuevo grupo con esta fecha como clave
            groupedTransactions[formattedDate] = {
                date: formattedDate,
                income: 0,
                expense: 0,
                transactions: []
            };
        }
        groupedTransactions[formattedDate].transactions = groupedTransactions[formattedDate].transactions?.length > 0 ? [...groupedTransactions[formattedDate].transactions, transaction] : [transaction];
        // Actualizar los ingresos y egresos en el grupo correspondiente
        if (transaction.type === 'income') {
            groupedTransactions[formattedDate].income += transaction.amount;
        } else if (transaction.type === 'expense') {
            groupedTransactions[formattedDate].expense += transaction.amount;
        }
        groupedTransactions[formattedDate].total = groupedTransactions[formattedDate].income - groupedTransactions[formattedDate].expense;

    });

    return groupedTransactions;
};

export const groupTransactionsByCategory = (transactions: Transaction[]) => {
    const groupedTransactions : GroupedCategories[] = [];
    const colors = [...colorsAvailable]
    transactions?.sort((a, b) => a.date - b.date).forEach(transaction => {
        if(!transaction.category) return;
        if(transaction.category === 'Income') return;
        const transactionCategory = transaction.category;        
        if (groupedTransactions?.filter(group => group?.category === transactionCategory)?.length === 0) {
            const colorSelected = colors[Math.floor(Math.random() * colors.length)];
            groupedTransactions.push({
                category: transactionCategory,
                income: 0,
                expense: 0,
                transactions: [],
                color: colorSelected
            })
            colors.splice(colors.indexOf(colorSelected), 1)
        }
        const transactionCategoryItem = groupedTransactions?.findIndex(group => group?.category === transactionCategory);
        groupedTransactions[transactionCategoryItem].transactions = groupedTransactions[transactionCategoryItem].transactions?.length > 0 ? [...groupedTransactions[transactionCategoryItem].transactions, transaction] : [transaction];
        if (transaction.type === 'income') {
            groupedTransactions[transactionCategoryItem].income += transaction.amount;
        } else if (transaction.type === 'expense') {
            groupedTransactions[transactionCategoryItem].expense += transaction.amount;
        }
        groupedTransactions[transactionCategoryItem].total = groupedTransactions[transactionCategoryItem].income - groupedTransactions[transactionCategoryItem].expense;
        
    });    
    return groupedTransactions;
}

export default groupTransactionsByDate;