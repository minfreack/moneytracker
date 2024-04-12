'use client'
import { CashflowContext } from "@/context/cashflow";
import { useContext, useEffect, useState } from "react";
import { AreaChart } from '@tremor/react';
import dayjs from "dayjs";
import groupTransactionsByDate from "@/utils/transactions";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const Analytics = () => {

    const {cashflow} = useContext(CashflowContext)    

    const [data, setData] = useState<any>([])

    const valueFormatter = (number: any) =>
  `$${Intl.NumberFormat('us').format(number).toString()}`;

    useEffect(() => {
        const records = groupTransactionsByDate([...cashflow?.lastTransactions] || [])
        setData(
            Object?.values(records || {})?.map((item: any) => {
                return {
                    date: dayjs(item?.date)?.format('DD/MM/YYYY'),
                    Ingresos: item?.income,
                    Gastos: item?.expense
                }
            })
        )


    }
    ,[cashflow])
    
    
    return (
        <section className="bg-content2 px-6 py-4 rounded-lg lg:w-1/2 ">
            <div className="flex w-full justify-between">
                <h2 className="text-2xl font-semibold col-span-3">📊  &nbsp; Analíticas</h2>
                <Link href="/dashboard/analytics">
                    <p className="text-sm inline-flex items-center gap-x-2 cursor-pointer">Ver más <FaArrowRight/> </p>
                </Link> 
            </div>
            <h3 className="pt-1">Así ha ido tu última semana:</h3>
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
        </section>
    )
}