import { NextResponse } from 'next/server';
import cookie from 'cookie';


export async function POST(request: Request) {

    const { email, password } = await request.json();

    const queryParams = new URLSearchParams({
        email,
        password
    }).toString();

    console.log("request", request);

    const response = await fetch(`https://api.sueennature.com/users/login?${queryParams}`, {
        method: 'POST', 
        headers: {
            'x-api-key': process.env.X_API_KEY || '', 
        }
    });

    const data = await response.json();

    if (response.ok) {
        const token = data.access_token;
        const cookieOptions = {
            httpOnly: false, 
            secure: true,
            maxAge: 60 * 60,
            path: '/',
        };

        return NextResponse.json(data, {
            headers: {
                'Set-Cookie': cookie.serialize('access_token', token, cookieOptions),
            }
        });
    } else {
        return NextResponse.json(data, { status: response.status });
    }
}
