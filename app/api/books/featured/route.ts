import { NextResponse } from 'next/server';
import { getBooks } from '@/app/lib/data';

/**
 * GET handler for retrieving all featured books.
 */
export async function GET() {
    try {
        const books = await getBooks();
        const featuredBooks = books.filter(book => book.featured === true);
        return NextResponse.json(featuredBooks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}
