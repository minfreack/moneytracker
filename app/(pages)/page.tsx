'use client'
import { AuthContext } from "@/context/auth";
import { useRouter} from 'next/navigation'
import {useContext, useEffect} from "react";


export default function Home() {

	const { userAuth } = useContext(AuthContext);
	const router = useRouter();

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
