'use client'
import { CashflowContext } from "@/context/cashflow";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { IoFilterOutline, IoTrash } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Switch } from "@nextui-org/switch";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

type Filters = {
    name: string;
    category: string | undefined;
    onlyIncomes: boolean;
    onlyExpenses: boolean
}

const initialState = {
    name: '',
    category: '',
    onlyIncomes: false,
    onlyExpenses: false
}

export const History = () => {
    
    const {cashflow} = useContext(CashflowContext)
    
    const [filterTransactions, setFilterTransactions] = useState(cashflow?.lastTransactions)
    
    const [filters, setFilters] = useState<Filters>(initialState)
    
    const onFilter = () => {
        let filtered = [...cashflow?.lastTransactions];        
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
        setFilterTransactions(filtered)
    }

    useEffect(() => {        
        onFilter()
    },[filters, cashflow])    
    
    return (
        <section className="bg-content2 relative px-6 py-4 rounded-lg lg:w-1/2 ">
            <div className="flex w-full justify-between">
                <h2 className="text-2xl font-semibold col-span-3">💾  &nbsp; Historial</h2>
                <Link href="/dashboard/transactions">
                    <p className="text-sm inline-flex items-center gap-x-2 cursor-pointer">Ver todas <FaArrowRight/> </p>
                </Link> 
            </div>
            <div className="flex justify-between">
                <h3 className="pt-1">Tus últimas transacciones</h3>
                <div className="flex gap-x-4">
                <Popover placement="left">
                    <PopoverTrigger>
                        <Button className="order-2 md:order-none" size="sm" variant="light"><IoSearchSharp className="cursor-pointer" size={24}/></Button>
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
                        <Button size="sm" variant="light"><IoFilterOutline className="cursor-pointer" size={24} /></Button>
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
            <div className="mt-4 w-full overflow-auto">
                <table className="w-full">
                    <thead className="bg-content3">
                    <tr className="px-2 rounded-t-lg w-[26rem] py-2 grid grid-cols-4 md:w-full md:grid md:grid-cols-[35%_27.5%_22.5%_15%]">
                        <th className="text-start">Nombre</th>
                        <th className="text-start">Categoría</th>
                        <th className="text-start">Cantidad</th>
                        <th className="text-start">Fecha</th>
                    </tr>
                    </thead>
                    <tbody className="bg-content1 rounded-lg h-60">
                    {
                        filterTransactions?.slice(0, 5)?.map((transaction, index) => (
                            <tr key={transaction?.date + index} className="px-2 py-2 w-[26rem] grid grid-cols-4 md:w-full md:grid-cols-[35%_27.5%_22.5%_15%]">
                                <td className="truncate">{transaction?.type === 'income' ? 'Ingreso' : transaction?.name}</td>
                                <td><Chip className="cursor-pointer w-full truncate" onClick={() => setFilters({...filters, category: transaction?.type === 'income' ? 'Income' : transaction?.category })}>{transaction?.type === 'income' ? 'Ingreso' : transaction?.category}</Chip></td>
                                <td className="truncate">${transaction?.amount}</td>
                                <td className="truncate">{dayjs(transaction?.date).format("DD/MM/YY")}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </section>
    )
}