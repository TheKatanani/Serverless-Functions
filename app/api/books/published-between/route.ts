import { NextResponse, type NextRequest } from 'next/server';
import { getBooks } from '@/app/lib/data';

/**
 * GET handler for retrieving books published within a specific date range.
 * Requires startDate and endDate query parameters in YYYY-MM-DD format.
 */
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

        // Check for invalid date strings
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
             return NextResponse.json({ message: 'Invalid date format. Please use YYYY-MM-DD.' }, { status: 400 });
        }

        const books = await getBooks();
        const filteredBooks = books.filter(book => {
            const publishedDate = new Date(book.datePublished);
            return publishedDate >= start && publishedDate <= end;
        });

        return NextResponse.json(filteredBooks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
