import { NextResponse, type NextRequest } from 'next/server';
import { getAllBooks, createBook, Book } from '@/app/lib/data';

/**
 * GET handler for retrieving all books.
 */
export async function GET() {
    try {
        const books = await getAllBooks();
        return NextResponse.json(books);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}

/**
 * POST handler for creating a new book.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, author, description, price, isbn } = body;

        // Basic validation
        if (!title || !author || !description || !price || !isbn) {
            return NextResponse.json({ message: 'Missing required fields for a new book.' }, { status: 400 });
        }
        
        // createBook function now handles all the logic
        const newBook = await createBook(body);

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}