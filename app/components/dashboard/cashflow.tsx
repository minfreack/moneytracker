'use client'
import { Card, CardBody } from "@nextui-org/card";
import { IncomeModal } from "../modals/income";
import { useContext, useState } from "react";
import { SpentModal } from "../modals/spent";
import { CashflowContext } from "@/context/cashflow";

export const CashFlow = () => {

    const [incomeModalOpen, setIncomeModalOpen] = useState(false)
    const [spentModalOpen, setSpentModalOpen] = useState(false)
    
    const {cashflow} = useContext(CashflowContext)
    
    return (
        <>
        <div className="bg-content2 px-6 py-4 rounded-lg grid grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-8">
            <h2 className="text-2xl font-semibold col-span-3">💸  &nbsp; Flujo</h2>
            <Card className="col-span-3 lg:col-span-1" isBlurred>
                <CardBody className="gap-y-2.5 px-5 py-6">
                    <div className="flex w-full justify-between">
                    <h3>Bolsa actual</h3>
                    {
                        cashflow?.total !== 0 && (
                            <p className={`${((cashflow?.income - cashflow?.expenses) / cashflow?.income) * 100 >= 50 ? 'text-green-300' : 'text-red-400'}`} >%{Math.round(((cashflow?.income - cashflow?.expenses) / cashflow?.income) * 100)}</p>
                        )
                    }
                    </div>
                    <p className="text-4xl font-medium">${cashflow?.total}</p>
                </CardBody>
            </Card>
            <Card className="col-span-3 lg:col-span-1" isBlurred>
                <CardBody className="gap-y-2.5 px-5 py-6">
                    <h3>Tus ingresos</h3>
                    <p onClick={() => setIncomeModalOpen(true)} className="bg-content3 cursor-pointer w-6 h-6 flex items-center justify-center pb-1 absolute right-4 rounded-full">+</p>
                    <p className="text-4xl font-medium">${cashflow?.income}</p>
                </CardBody>
            </Card>
            <Card className="col-span-3 lg:col-span-1" isBlurred>
                <CardBody className="gap-y-2.5 px-5 py-6">
                    <h3>Tus gastos</h3>
                    <p onClick={() => setSpentModalOpen(true)} className="bg-content3 cursor-pointer w-6 h-6 flex items-center justify-center pb-1 absolute right-4 rounded-full">+</p>
                    <p className="text-4xl font-medium">${cashflow?.expenses}</p>
                </CardBody>
            </Card>
        </div>
        <IncomeModal isOpen={incomeModalOpen} onClose={() => setIncomeModalOpen(false)}/>
        <SpentModal isOpen={spentModalOpen} onClose={() => setSpentModalOpen(false)}/>
        </>
    )
}