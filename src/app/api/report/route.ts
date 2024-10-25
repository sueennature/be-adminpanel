import { NextResponse } from 'next/server';
import Cookies from "js-cookie";

export async function getReports({ type, start_date, end_date }: { type: string; start_date: string; end_date: string }) {
    try {
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
            return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
        }

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        const response = await fetch(`https://be-api-development.up.railway.app/reports/${type}?start_date=${start_date}&end_date=${end_date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': process.env.X_API_KEY || '', 
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Failed to get reports', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
