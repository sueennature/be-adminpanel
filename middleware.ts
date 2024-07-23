import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(request: NextRequest) {
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const accessToken = cookies.access_token;

    if (!accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected/*'], 
};
