'use client'

import PrivateRoute from "@/app/components/routes";
import { AuthContext } from "@/context/auth";
import { getUser } from "@/services/api/users";
import signIn from "@/services/firebase/auth/sign-in";
import { signUpWithGoogle } from "@/services/firebase/auth/sign-up";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function Login(){

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
            const res = await signIn(formValues?.email, formValues?.password);
            
            if(
                res?.error?.code
            ){                
                switch (res?.error.code) {
                    case 'auth/user-not-found':
                      return toast.error('No se encontró ninguna cuenta asociada a esta dirección de correo electrónico. Por favor, registra una cuenta o verifica la dirección de correo electrónico proporcionada.');
                    case 'auth/invalid-email':
                      return toast.error('La dirección de correo electrónico proporcionada no es válida. Por favor, verifica e inténtalo nuevamente.');
                    case 'auth/invalid-credential':
                      return toast.error('La dirección de correo electrónico proporcionada no es válida o no hay un usuario registrado con estas credenciales. Por favor, verifica e inténtalo nuevamente.');
                    case 'auth/too-many-requests':
                      return toast.error('Tu acceso se ha bloqueado temporalmente por muchos intentos fallidos. Por favor, espera e inténtalo nuevamente en unos minutos.');
                    case 'auth/wrong-password':
                      return toast.error('La contraseña proporcionada es incorrecta. Por favor, verifica e inténtalo nuevamente.');
                    default:
                      return toast.error('Se ha producido un error al intentar iniciar sesión. Por favor, intenta nuevamente más tarde.');
                  }
            }            
            if(res?.result?.user?.uid){
                const {data: resData} = await getUser({id: res?.result?.user?.uid})                           
                if(resData?.success){
                    toast.success('Bienvenido de vuelta :)')
                    setUserAuth({
                        user: resData?.data,
                        auth: res?.result?.user
                    })
                    router.push('/dashboard')
                }else{
                    return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
                }
            }else{
                return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
            }
        } catch (error) {            
            return toast.error('Se ha producido un error, por favor comunícate con el desarrollador');
        }
    }

    const onSignUpWithGoogle = async() => {
        try {
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
            if(res?.result?.user?.uid){
                const {data: resData} = await getUser({id: res?.result?.user?.uid})                           
                if(resData?.success){
                    setUserAuth({
                        user: resData?.data,
                        auth: res?.result?.user
                    })
                    toast.success('Bienvenido de vuelta :)')
                    router.push('/dashboard')
                }else{
                    return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
                }
            }else{
                return toast.error('Parece que no hay ningún usuario vinculado a esta cuenta, intenta nuevamente o regístrate');
            }
        } catch (error) {            
            return toast.error('Se ha producido un error, por favor comunícate con el desarrollador');
        }
    }


    return (
        <PrivateRoute>
            <section className="flex h-screen items-center justify-between gap-y-8">
                <div className="w-full md:w-1/2 xl:w-1/3 flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <h4 className="text-lg font-semibold">Bienvenido de nuevo</h4>
                        <h3 className="text-6xl font-semibold">Iniciar sesión</h3>
                        <p className="text-sm font-semibold">¿Aún no estás registrado? <Link href="/register"><span className="cursor-pointer text-primary">Regístrate aquí</span></Link></p>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-wrap w-full gap-x-5 gap-y-4 pt-4">
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
                                Iniciar sesión
                            </Button>
                        </div>
                    </form>
                </div>
                <div>
                    Aqui una img
                </div>
            </section>
        </PrivateRoute>
    )
}