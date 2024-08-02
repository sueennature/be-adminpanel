// utils/auth.js
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

export function useAuthRedirect() {
    const router = useRouter();
    const token = Cookies.get('access_token');
    const hasNotified = useRef(false);

    // useEffect(() => {
    //     if (!token && !hasNotified.current) {
    //         toast.error("Session Terminated, Please login again");
    //         hasNotified.current = true;
    //         setTimeout(() => {
    //             router.push('/');
    //         }, 1500);
    //     }
    // }, [token, router]); // Ensure dependencies are correctly specified
    console.log("sad")
}
