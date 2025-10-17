import { NextResponse, type NextRequest } from 'next/server';
import { getBooks, getReviews, saveReviews, type Review } from '@/app/lib/data';

/**
 * POST handler for creating a new review for a book.
 */
export async function POST(
  req: NextRequest,
  _context: { params: {} } // ✅ required by Next.js types
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
    const books = await getBooks();
    const bookExists = books.some(b => b.id === bookId);
    if (!bookExists) {
      return NextResponse.json(
        { message: `Cannot add review: Book with ID ${bookId} not found.` },
        { status: 404 }
      );
    }

    const reviews = await getReviews();
    const newReview: Review = {
      id: `review-${Date.now()}`, // Generate a unique ID
      bookId,
      author,
      rating: Number(rating),
      title,
      comment,
      timestamp: new Date().toISOString(),
      verified: body.verified ?? false,
    };

    reviews.push(newReview);
    await saveReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    );
  }
}
