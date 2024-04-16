'use client'

import { CashflowContext } from "@/context/cashflow";
import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Switch } from "@nextui-org/switch";
import dayjs from "dayjs";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoFilterOutline, IoTrash } from "react-icons/io5";
import { AuthContext } from "@/context/auth";
import { getTransactions } from "@/services/api/transactions";
import { types } from "@/context/cashflow/cashflowReducer";
import { Select, SelectItem } from "@nextui-org/select";
import groupTransactionsByDate, { groupTransactionsByCategory } from "@/utils/transactions";
import { AreaChart, DonutChart, List, ListItem } from "@tremor/react";

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
    
    const [data, setData] = useState<any>([])

    const [data2, setData2] = useState<any>([])

    const [filters, setFilters] = useState<Filters>(initialState)

    const valueFormatter = (number: any) =>
    `$${Intl.NumberFormat('us').format(number).toString()}`;
    
    const onFilter = () => {
        if(cashflow?.transactions?.length === 0){
            return;
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
        const records = groupTransactionsByDate(filtered || [])        
        setData(
            Object?.values(records || {})?.map((item: any) => {
                return {
                    date: dayjs(item?.date)?.format('DD/MM/YYYY'),
                    Ingresos: item?.income,
                    Gastos: item?.expense,
                    Total: item?.total
                }
            })
        )
        const records2 = groupTransactionsByCategory(filtered|| [])
        setData2(
            Object?.values(records2 || {})?.map((item: any) => {
                return {
                    category: item?.category,
                    amount: item?.expense,
                    color: item?.color
                }
            })
        )
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
           
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex w-full flex-col">
                        <h2 className="text-2xl font-semibold col-span-3">📊  &nbsp; Analíticas</h2>
                        <h3 className="pt-1">Tu panel de analíticas</h3>
                    </div>
                    <div className="flex gap-x-4 pt-4 md:pt-0 items-center">
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
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <article className="w-full bg-content2 px-8 py-4 rounded-lg">
                <h3 className="pt-1 text-xl font-semibold">Balance:</h3>
                    <AreaChart
                        data={data}
                        index="date"
                        categories={['Total']}
                        colors={['cyan']}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        showYAxis={false}
                        showGradient={false}
                        startEndOnly={true}
                        className="mt-6 h-72"
                        />
                </article>
                <article className="w-full bg-content2 px-8 py-4 rounded-lg">
                <h3 className="pt-1 text-xl font-semibold">Ingresos vs Gastos:</h3>
                    <AreaChart
                        data={data}
                        index="date"
                        categories={['Ingresos', 'Gastos']}
                        colors={['blue', 'violet']}
                        valueFormatter={valueFormatter}
                        showLegend={false}
                        showYAxis={false}
                        showGradient={false}
                        startEndOnly={true}
                        className="mt-6 h-72"
                        />
                </article>
                <article className="w-full bg-content2 px-8 py-4 rounded-lg">
                <h3 className="pt-1 text-xl font-semibold">Categorías de gastos:</h3>
                <DonutChart
                        className="mt-8"
                        data={data2}
                        category="amount"
                        index="name"
                        showTooltip={false}
                        valueFormatter={valueFormatter}
                        colors={data2?.map((item: any) => item?.color)}
                />
                <List className="mt-2">
          {data2.map((item: any) => (
            <ListItem key={item.category} className="space-x-6">
              <div className="flex items-center space-x-2.5 truncate">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-sm bg-${item.color}-500`}
                  aria-hidden={true}
                />
                <span className="truncate dark:text-dark-tremor-content-emphasis">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {valueFormatter(item.amount)}
                </span>
                <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                  {item.share}
                </span>
              </div>
            </ListItem>
          ))}
        </List>

                </article>
            </div>
        </>
    )
}