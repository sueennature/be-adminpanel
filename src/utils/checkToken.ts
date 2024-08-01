// utils/auth.js
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
    const router = useRouter();
    const token = Cookies.get('access_token');

    if (!token) {
        router.push('/');
    }
}
