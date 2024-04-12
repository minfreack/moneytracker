const url = process.env.NEXT_PUBLIC_API_URL

type GetTransactions = {
    userID: string | undefined
}

export const getTransactions = async(data : GetTransactions) => {
    const res = await fetch(`${url}/v1/cashflow/all-transactions`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });
    const resData = await res.json();
    return {
        data: resData
    }
}