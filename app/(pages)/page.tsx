'use client'
import { title, subtitle } from "@/app/components/primitives";
import { AuthContext } from "@/context/auth";
import { redirect } from 'next/navigation'
import { useContext, useEffect } from "react";


export default function Home() {
    const {userAuth} = useContext(AuthContext)
		
	useEffect(() => {
		if(userAuth?.auth?.auth){
			redirect('/dashboard')
		}
	},[])


	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Make&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
				<br />
				<h1 className={title()}>
					websites regardless of your design experience.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern React UI library.
				</h2>
			</div>
		</section>
	);
}