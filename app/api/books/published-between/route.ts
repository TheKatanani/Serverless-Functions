import { NextResponse, type NextRequest } from 'next/server';
import { getBooksByDateRange } from '@/app/lib/data';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
        return NextResponse.json({ message: 'Both startDate and endDate query parameters are required.' }, { status: 400 });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
             return NextResponse.json({ message: 'Invalid date format. Please use YYYY-MM-DD.' }, { status: 400 });
        }

        const filteredBooks = await getBooksByDateRange(start, end);
        return NextResponse.json(filteredBooks);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}