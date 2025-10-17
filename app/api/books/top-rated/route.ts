import { NextResponse } from 'next/server';
import { getBooks } from '@/app/lib/data';

/**
 * GET handler for retrieving the top 10 rated books.
 * Rating is calculated as: rating * reviewCount.
 */
export async function GET() {
    try {
        const books = await getBooks();
        const sortedBooks = [...books]
            .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        
        const top10Books = sortedBooks.slice(0, 10);
        return NextResponse.json(top10Books);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}
