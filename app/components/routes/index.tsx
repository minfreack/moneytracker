'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/auth';

const PrivateRoute = ({ children }: any) => {
  const { userAuth } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!userAuth?.auth?.auth) {
        if(pathname === '/login' || pathname === '/register') {
            setLoading(false);
            return;
        }
        if(pathname === '/dashboard') {
            await router.push('/login');
            setLoading(false);
            return;
        }
      } else if (pathname === '/login' || pathname === '/register') {
        await router.push('/dashboard');
        setLoading(false); 
      }
      setLoading(false); 
    };

    checkAuthentication();
  }, [userAuth, router]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <>{children}</>
  );
};

export default PrivateRoute;
