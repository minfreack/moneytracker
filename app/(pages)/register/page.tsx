'use client'
import signUp, { signUpWithGoogle } from "@/services/firebase/auth/sign-up";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import {newUser} from '@/services/api/users'
import Link from "next/link";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/app/components/routes";

export default function Register(){

    const {setUserAuth} = useContext(AuthContext)

    const [formValues, setFormValues] = useState({
        name: '',
        lastNames: '',
        email: '',
        password: '',
    })

    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        })
    }

    const onSubmit = async(e: FormEvent<HTMLFormElement>) => {
        try {
            e?.preventDefault();    
            const res = await signUp(formValues?.email, formValues?.password);
            if(
                res?.error?.code
            ){
                switch (res.error?.code) {
                    case "auth/email-already-in-use":
                        return toast.error('El correo electrónico ya está siendo utilizado por otra cuenta o vínculado a otro tipo de autenticación.');
                    case "auth/invalid-email":
                        return toast.error('El correo electrónico proporcionado no es válido.');
                    case "auth/weak-password":
                        return toast.error('La contraseña proporcionada no es lo suficientemente segura. Debe tener al menos 6 caracteres.');
                    case "auth/network-request-failed":
                        return toast.error('Hubo un error de red al intentar realizar la operación. Por favor, inténtelo de nuevo más tarde.');
                    case "auth/timeout":
                        return toast.error('La solicitud ha excedido el tiempo de espera. Por favor, inténtelo de nuevo más tarde.');
                    case "auth/internal-error":
                        return toast.error('Se ha producido un error interno en el servidor de autenticación. Por favor, inténtelo de nuevo más tarde.');
                    default:
                        return toast.error('Se produjo un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
                }
            }
            const {data: resData} = await newUser({
                name: formValues?.name,
                lastNames: formValues?.lastNames,
                email: formValues?.email,
                id: res?.result?.user?.uid
            })
            if(resData?.success){
                toast.success('Te has registrado correctamente :)')
                setUserAuth({
                    user: resData?.data,
                    auth: res?.result?.user
                })
            }
            router.push('/dashboard')
        } catch (error) {
            return toast.error('Se ha producido un error, por favor comunícate con el desarrollador');
        }
    }

    const onSignUpWithGoogle = async() => {
        const res = await signUpWithGoogle()
        if(
            res?.error?.code
        ){
            switch (res?.error?.code) {
                case 'auth/popup-closed-by-user':
                  return toast.error('La ventana de autenticación se cerró antes de completar el proceso.');
                case 'auth/popup-blocked':
                  return toast.error('La ventana emergente de Google fue bloqueada por el navegador. Por favor, habilita las ventanas emergentes y vuelve a intentarlo.');
                case 'auth/cancelled-popup-request':
                  return toast.error('La solicitud de ventana emergente de Google fue cancelada. Por favor, vuelve a intentarlo.');
                case 'auth/popup-open-failed':
                  return toast.error('Hubo un error al intentar abrir la ventana emergente de Google. Por favor, intenta nuevamente o usa otro método de autenticación.');
                case 'auth/internal-error':
                  return toast.error('Se ha producido un error interno al intentar autenticarse con Google. Por favor, intenta nuevamente.');
                default:
                  return toast.error('Se ha producido un error al intentar autenticarse con Google. Por favor, intenta nuevamente.');
              }
        }
        const {data: resData} = await newUser({
            name: res?.result?.user?.displayName,
            email: res?.result?.user?.email,
            id: res?.result?.user?.uid
        })
        if(resData?.success){
            setUserAuth({
                user: resData?.data,
                auth: res?.result?.user
            })
            toast.success('Te has registrado correctamente :)')
            router.push('/dashboard')
        }else{
            return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
        }        
    }

    return (
        <PrivateRoute>
            <section className="grid grid-cols-1 lg:grid-cols-2 h-screen items-center justify-between gap-y-8">
                <div className="w-full xl:w-2/3 flex flex-col gap-y-5 pl-10">
                    <div className="flex flex-col gap-y-2">
                        <h4 className="text-lg font-semibold">Empieza gratis</h4>
                        <h3 className="text-6xl font-semibold">Crea tu cuenta</h3>
                        <p className="text-sm font-semibold">¿Ya estás registrado? <Link href="/login"><span className="cursor-pointer text-primary">Inicia sesión aquí</span></Link></p>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-wrap w-full gap-x-5 gap-y-4 pt-4">
                        <Input
                            name="name"
                            type="text"
                            label="Nombre"
                            placeholder="Ingresa tu nombre"
                            labelPlacement="outside"
                            className="w-full flex-1"
                            isRequired
                            onChange={onChange}
                        />
                        <Input
                            name="lastNames"
                            type="text"
                            label="Apellido"
                            placeholder="Ingresa tu apellido"
                            labelPlacement="outside"
                            className="w-full md:w-1/2"
                            isRequired
                            onChange={onChange}
                        />
                        <Input
                            name="email"
                            type="text"
                            label="Email"
                            placeholder="Ingresa tu email"
                            labelPlacement="outside"
                            className="w-full"
                            isRequired
                            onChange={onChange}
                        />
                        <Input
                            name="password"
                            label="Contraseña"
                            placeholder="Ingresa tu contraseña"
                            labelPlacement="outside"
                            className="w-full"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <FaEyeSlash className="text-sm text-default-400 pointer-events-none" />
                                ) : (
                                    <FaEye className="text-sm text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            isRequired
                            onChange={onChange}
                        />
                        <div className="w-full self-end flex gap-x-4">
                            <Button onClick={onSignUpWithGoogle} variant="bordered" className="w-1/3 mt-2">
                                Iniciar con <FaGoogle />
                            </Button>
                            <Button type="submit" color="primary" className="w-1/3 mt-2">
                                Crear cuenta
                            </Button>
                        </div>
                    </form>
                </div>
                <img loading='lazy' src='/money.jpg' className='hidden lg:block h-screen w-full' alt='Money' />
 </section>
        </PrivateRoute>
    )
}