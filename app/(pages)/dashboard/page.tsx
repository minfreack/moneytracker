import { Navbar } from "@/app/components/navbar";
import { CashFlow } from "@/app/components/dashboard/cashflow";
import { History } from "@/app/components/dashboard/history";
import { Analytics } from "@/app/components/dashboard/analytics";
import PrivateRoute from "@/app/components/routes";

export default function Dashboard(){
    return (
        <PrivateRoute>
            <section className="flex flex-col gap-y-8">
                <Navbar />
                <CashFlow/>
                <div className="flex flex-col lg:flex-row gap-x-4 gap-y-8">
                    <History/>
                    <Analytics/>
                </div>
            </section>
        </PrivateRoute>
    )
}