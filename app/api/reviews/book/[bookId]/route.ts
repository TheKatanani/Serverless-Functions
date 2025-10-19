import { NextResponse } from 'next/server';
import { getBookById, getReviewsForBook } from '@/app/lib/data';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;

    if (!bookId) {
      return NextResponse.json({ message: 'Book ID is required.' }, { status: 400 });
    }

    // Check if the book exists
    const bookExists = await getBookById(bookId);

    if (!bookExists) {
      return NextResponse.json(
        { message: `Book with ID "${bookId}" not found.` },
        { status: 404 }
      );
    }

    // Fetch reviews for that book
    const bookReviews = await getReviewsForBook(bookId);

    return NextResponse.json(bookReviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}