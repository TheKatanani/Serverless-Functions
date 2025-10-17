import { NextResponse } from 'next/server';
import { getBooks, getReviews } from '@/app/lib/data';

/**
 * GET handler for retrieving all reviews for a specific book.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;

    // Validate book ID
    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required.' }, { status: 400 });
    }

    // Check if the book exists
    const books = await getBooks();
    const bookExists = books.some((b) => b.id === bookId);

    if (!bookExists) {
      return NextResponse.json(
        { message: `Book with ID "${bookId}" not found.` },
        { status: 404 }
      );
    }

    // Fetch reviews for that book
    const reviews = await getReviews();
    const bookReviews = reviews.filter((review) => review.bookId === bookId);

    return NextResponse.json(bookReviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}
