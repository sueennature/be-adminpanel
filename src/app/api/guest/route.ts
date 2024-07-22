import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const guestData = await request.json();

        const response = await fetch('https://api.sueennature.com/guests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.X_API_KEY || '', 
            },
            body: JSON.stringify(guestData),
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
