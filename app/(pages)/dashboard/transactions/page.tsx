'use client'

import { CashflowContext } from "@/context/cashflow";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Switch } from "@nextui-org/switch";
import dayjs from "dayjs";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoFilterOutline, IoSearchSharp, IoTrash } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { AuthContext } from "@/context/auth";
import { getTransactions } from "@/services/api/transactions";
import { types } from "@/context/cashflow/cashflowReducer";
import { Select, SelectItem } from "@nextui-org/select";

type Filters = {
    name: string;
    category: string | undefined;
    onlyIncomes: boolean;
    onlyExpenses: boolean,
    orderDatesIn: string;
    orderAmountsIn: string;
    showBy: string
}

const initialState = {
    name: '',
    category: '',
    onlyIncomes: false,
    onlyExpenses: false,
    orderDatesIn: '',
    orderAmountsIn: '',
    showBy: 'all'
}

export default function Transactions(){
    const {userAuth} = useContext(AuthContext)

    const {cashflow, dispatch} = useContext(CashflowContext)    

    const [filterTransactions, setFilterTransactions] = useState(cashflow?.transactions)
    
    const [filters, setFilters] = useState<Filters>(initialState)
    
    const onFilter = () => {
        if(cashflow?.transactions?.length === 0){
            return setFilterTransactions([])
        }
        let filtered = [...cashflow?.transactions];
        if(filters?.showBy === 'week'){
            filtered = filtered?.filter((transaction) => transaction?.date >= dayjs().subtract(7, 'day').valueOf())
        }
        if(filters?.showBy === 'month'){
            filtered = filtered?.filter((transaction) => transaction?.date >= dayjs().subtract(1, 'month').valueOf())
        }
        if(filters?.showBy === 'year'){
            filtered = filtered?.filter((transaction) => transaction?.date >= dayjs().subtract(1, 'year').valueOf())
        }
        if(filters?.onlyIncomes){
            filtered = filtered?.filter((transaction) => transaction?.type === 'income');
        }
        if(filters?.onlyExpenses){
            filtered = filtered?.filter((transaction) => transaction?.type === 'expense');
        }
        if(filters?.category){
            filtered = filtered?.filter((transaction) => transaction?.category === filters?.category);
        }
        if(filters?.name){
            filtered = filtered?.filter((transaction) => transaction?.name?.trim()?.toLowerCase()?.includes(filters?.name?.toLowerCase()))
        }
        if(filters?.orderDatesIn === 'desc'){            
            filtered = filtered?.sort((a , b) => b.date - a.date )
        }
        if(filters?.orderDatesIn === 'asc'){
            filtered = filtered?.sort((a , b) => a.date - b.date )
        }
        if(filters?.orderDatesIn === 'desc'){            
            filtered = filtered?.sort((a , b) => b.amount - a.amount )
        }
        if(filters?.orderDatesIn === 'asc'){
            filtered = filtered?.sort((a , b) => a.amount - b.amount )
        }
        setFilterTransactions(filtered)
    }    

    useEffect(() => {
        onFilter()
    },[filters, cashflow])

    useEffect(() => {
        const getAllTransactions = async() => {
            if(!userAuth?.auth?.uid) return
            const {data: resData} = await getTransactions({userID: userAuth?.auth?.uid})                                                   
            if(resData?.success){
                const {transactions, records} = resData?.data 
                dispatch({type: types.allTransactions, payload: {transactions, records}})
            }
        }
        getAllTransactions()
    }, [userAuth]);
    
    return (
        <>
            <Link href="/dashboard">
                    <p className="mt-10 mb-5 text-sm inline-flex items-center gap-x-2 cursor-pointer"><FaArrowLeft/> Volver al dashboard </p>
             </Link> 
                <section className="bg-content2 relative px-6 py-4 rounded-lg mb-10">
        <div className="flex w-full justify-between">
            <h2 className="text-2xl font-semibold col-span-3">💾  &nbsp; Historial</h2>
        </div>
        <div className="flex justify-between">
            <h3 className="pt-1">Todas tus transacciones</h3>
            <div className="flex gap-x-4 items-center">
            <Select 
            onChange={(e) => {
                setFilters({...filters, showBy: e.target.value})
            }}
            multiple={false} label="Mostrar por" defaultSelectedKeys={['all']} className="w-52">
                <SelectItem value="all" key="all">Todas</SelectItem>
                <SelectItem value="week" key="week">Hace una semana</SelectItem>
                <SelectItem value="month" key="month">Hace 30 días</SelectItem>
                <SelectItem value="year" key="year">Hace un año</SelectItem>
            </Select>
            <Popover placement="left">
                <PopoverTrigger>
                    <Button size="sm" className="h-full" variant="light"><IoSearchSharp className="cursor-pointer" size={24}/></Button>
                </PopoverTrigger>
                <PopoverContent className="py-2">
                    <Input
                    type="text"
                    label="Gasto"
                    className="w-48"
                    placeholder="Buscar por nombre"
                    onChange={(e) => setFilters({...filters, name: e.target.value})}
                />
                </PopoverContent>
            </Popover>
            <Popover placement="left">
                <PopoverTrigger>
                    <Button size="sm" className="h-full" variant="light"><IoFilterOutline className="cursor-pointer" size={24} /></Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Switch className="my-2" isSelected={filters?.onlyIncomes} onValueChange={(value) => setFilters({...filters, onlyIncomes: value})} defaultSelected size="sm">Solo ingresos</Switch>
                    <Switch isSelected={filters?.onlyExpenses} onValueChange={(value) => setFilters({...filters, onlyExpenses: value})} defaultSelected size="sm">Solo egresos</Switch>
                </PopoverContent>
            </Popover>
            {
                JSON.stringify(initialState) !== JSON.stringify(filters) && (
                    <Button onClick={() => setFilters(initialState)} size="sm" variant="light"><IoTrash className="cursor-pointer" size={24} /></Button>
                )
            }
            </div>
        </div>
        <table className="mt-4 w-full overflow-x-scroll">
            <thead className="bg-content3">
                <tr className="px-2 rounded-t-lg py-2 grid grid-cols-[27.5%_27.5%_20%_20%] lg:grid-cols-[35%_27.5%_22.5%_15%]">
                    <th className="text-start">Nombre</th>
                    <th className="text-start">Categoría</th>
                    <th className="text-start inline-flex items-center gap-x-2">Cantidad
                        {(filters?.orderDatesIn === 'desc' || filters?.orderDatesIn === '') &&
                            <IoIosArrowDown className="cursor-pointer" onClick={() => setFilters({...filters, orderDatesIn: 'asc'})}/> 
                        }
                        {filters?.orderDatesIn === 'asc' &&
                          <IoIosArrowDown onClick={() => setFilters({...filters, orderDatesIn: 'desc'})} className="rotate-180 cursor-pointer"/>
                        }
                    </th>
                    <th className="text-start inline-flex items-center gap-x-2">Fecha 
                        {(filters?.orderDatesIn === 'desc' || filters?.orderDatesIn === '') &&
                            <IoIosArrowDown className="cursor-pointer" onClick={() => setFilters({...filters, orderDatesIn: 'asc'})}/> 
                        }
                        {filters?.orderDatesIn === 'asc' &&
                          <IoIosArrowDown onClick={() => setFilters({...filters, orderDatesIn: 'desc'})} className="rotate-180 cursor-pointer"/>
                        }
                    </th>
                </tr>
            </thead>
            <tbody className="bg-content1 rounded-lg h-60">
                {
                    filterTransactions?.map((transaction) => (
                        <tr className="px-2 py-2 grid grid-cols-[27.5%_27.5%_20%_20%] lg:grid-cols-[35%_27.5%_22.5%_15%]">
                            <td className="truncate">{transaction?.type === 'income' ? 'Ingreso' : transaction?.name}</td>
                            <td><Chip className="cursor-pointer w-full truncate" onClick={() => setFilters({...filters, category: transaction?.type === 'income' ? 'Income' : transaction?.category })}>{transaction?.type === 'income' ? 'Ingreso' : transaction?.category}</Chip></td>
                            <td className="truncate">${transaction?.amount}</td>
                            <td className="truncate">{dayjs(transaction?.date).format("DD/MM/YY")}</td>
                        </tr>
                    ))
                }     
            </tbody>
        </table>
    </section>
        </>
    )
}