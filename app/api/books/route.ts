import { NextResponse, type NextRequest } from 'next/server';
import { getBooks, saveBooks, Book } from '@/app/lib/data';

/**
 * GET handler for retrieving all books.
 */
export async function GET() {
    try {
        const books = await getBooks();
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

        const books = await getBooks();
        const newBook: Book = {
            id: String(books.length + 1), // Simple ID generation for this example
            title,
            author,
            description,
            price,
            isbn,
            genre: body.genre || [],
            tags: body.tags || [],
            datePublished: new Date().toISOString().split('T')[0],
            pages: body.pages || 0,
            language: body.language || "English",
            publisher: body.publisher || "Unknown",
            rating: 0,
            reviewCount: 0,
            inStock: body.inStock !== undefined ? body.inStock : true,
            featured: body.featured !== undefined ? body.featured : false,
        };

        books.push(newBook);
        await saveBooks(books);

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
