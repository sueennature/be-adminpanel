import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server";

interface ReportParams {
    type: string;
    start_date: string;
    end_date: string;
}

interface ErrorResponse {
    error: string;
    details?: any;
}

// The actual GET handler for Next.js API route
export const dynamic = 'force-dynamic'; // Mark the route as dynamic

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const start_date = searchParams.get("start_date");
        const end_date = searchParams.get("end_date");

        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
            return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
        }

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        const apiKey = process.env.X_API_KEY;
        if (!apiKey) {
            console.error('API Key is missing in environment variables');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const response = await fetch(`https://be-api-development.up.railway.app/reports/${type}?start_date=${start_date}&end_date=${end_date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Failed to get reports', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
