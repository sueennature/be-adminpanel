import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('access_token');
        if (!token) {
            router.push('/');
        }
    }, [router]);
};

export default useAuth;
