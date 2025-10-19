import { NextResponse, type NextRequest } from 'next/server';
import { getBookById, createReview, type Review } from '@/app/lib/data';

export async function POST(
  req: NextRequest,
  _context: { params: {} }
) {
  try {
    const body = await req.json();
    const { bookId, author, rating, title, comment } = body;

    // Basic validation
    if (!bookId || !author || !rating || !title || !comment) {
      return NextResponse.json(
        { message: 'Missing required fields for a new review.' },
        { status: 400 }
      );
    }

    // Check if the book exists before adding a review for it
    const bookExists = await getBookById(bookId);
    if (!bookExists) {
      return NextResponse.json(
        { message: `Cannot add review: Book with ID ${bookId} not found.` },
        { status: 404 }
      );
    }

    // createReview function now handles all the logic
    const newReview = await createReview(body);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    );
  }
}