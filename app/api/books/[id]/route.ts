import { NextResponse } from 'next/server';
import { getBooks } from '@/app/lib/data';

/**
 * GET handler for retrieving a single book by its ID.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const books = await getBooks();
        const paramsResolved = await params;
        const book = books.find(b => b.id === paramsResolved.id);
        
        if (book) {
            return NextResponse.json(book);
        } else {
            return NextResponse.json({ message: `Book with ID ${paramsResolved.id} not found` }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}
