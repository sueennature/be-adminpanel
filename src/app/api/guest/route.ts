import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const guestData = await request.json();
        const BE_URL = process.env.BE_URL;

        const response = await fetch(`${BE_URL}/guests/`, {
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
