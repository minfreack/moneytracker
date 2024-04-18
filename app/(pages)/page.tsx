'use client'
import { title, subtitle } from "@/app/components/primitives";
import { AuthContext } from "@/context/auth";
import {redirect, usePathname, useRouter} from 'next/navigation'
import {useContext, useEffect, useState} from "react";


export default function Home() {

	const { userAuth } = useContext(AuthContext);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const checkAuthentication = async () => {
			if (!userAuth?.auth?.auth) {
					await router.push('/login');
					return;
			}
			if (userAuth?.auth?.auth) {
				await router.push('/dashboard');
				return;
			}
		};

		checkAuthentication();
	}, [userAuth, router]);


	return
}
