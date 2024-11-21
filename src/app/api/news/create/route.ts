import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export async function POST(request: any) {
    try {
        const cookies = parseCookies(request);
        const BE_URL = process.env.BE_URL;
        const accessToken = cookies.access_token;
        console.log(accessToken);
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
        }

        const newsData = await request.json();

        const response = await fetch(`${BE_URL}/news/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': process.env.X_API_KEY || '', 
            },
            body: JSON.stringify(newsData),
        });
        

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Failed to create guest', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
