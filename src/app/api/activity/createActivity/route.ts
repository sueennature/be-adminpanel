import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(request: any) {
    try {
        const BE_URL = process.env.BE_URL;
        const cookies = cookie.parse(request.headers.get('cookie') || '');
        const accessToken = cookies.access_token;
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
        }

        const ActivityData = await request.json();

        const response = await fetch(`${BE_URL}/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': process.env.X_API_KEY || '', 
            },
            body: JSON.stringify(ActivityData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Failed to create Activity', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}