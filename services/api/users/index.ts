const url = process.env.NEXT_PUBLIC_API_URL

type NewUser = {
    name: string | null | undefined;
    lastNames?: string;
    email: string | null | undefined;
    id: string | undefined
}

type GetUser = {
    id: string | undefined
}


export const newUser = async(data : NewUser) => {
    const res = await fetch(`${url}/v1/users/user-new`,{
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

export const getUser = async(data : GetUser) => {
    const res = await fetch(`${url}/v1/users/user`,{
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

export default newUser;