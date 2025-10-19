import { connectToDatabase } from './mongodb';
import { Collection, ObjectId, Document } from 'mongodb';
import { nanoid } from 'nanoid';

// --- TYPE DEFINITIONS ---
// These interfaces remain the same
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    image?: string;
    isbn: string;
    genre: string[];
    tags: string[];
    datePublished: string | Date; // Allow Date object for DB ops
    pages: number;
    language: string;
    publisher: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    featured: boolean;
    _id?: ObjectId; // MongoDB's default ID
}

export interface Review {
    id: string;
    bookId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    timestamp: string | Date; // Allow Date object for DB ops
    verified: boolean;
    _id?: ObjectId; // MongoDB's default ID
}

// --- HELPER FUNCTIONS ---

// Helper to get the collections
async function getCollections() {
    const { db } = await connectToDatabase();
    const booksCollection: Collection<Document> = db.collection('books');
    const reviewsCollection: Collection<Document> = db.collection('reviews');
    return { booksCollection, reviewsCollection, db };
}

// Helper to sanitize MongoDB's _id
function sanitizeId<T extends Document>(doc: T): Omit<T, '_id'> & { db_id?: string } {
    const { _id, ...rest } = doc;
    return rest as Omit<T, '_id'> & { db_id?: string };
}


// --- NEW DATABASE FUNCTIONS ---

/**
 * Retrieves all books from the database.
 */
export async function getAllBooks(): Promise<Book[]> {
    const { booksCollection } = await getCollections();
    const books = await booksCollection.find({}).toArray();
    return books.map(doc => sanitizeId(doc as Book));
}

/**
 * Retrieves a single book by its custom 'id' field.
 */
export async function getBookById(id: string): Promise<Book | null> {
    const { booksCollection } = await getCollections();
    const book = await booksCollection.findOne({ id: id });
    return book ? sanitizeId(book as Book) : null;
}

/**
 * Retrieves all featured books.
 */
export async function getFeaturedBooks(): Promise<Book[]> {
    const { booksCollection } = await getCollections();
    const featuredBooks = await booksCollection.find({ featured: true }).toArray();
    return featuredBooks.map(doc => sanitizeId(doc as Book));
}

/**
 * Retrieves the top 10 rated books, sorted by (rating * reviewCount).
 */
export async function getTopRatedBooks(): Promise<Book[]> {
    const { booksCollection } = await getCollections();
    const topRatedBooks = await booksCollection.aggregate([
        {
            // Calculate the score
            $addFields: {
                score: { $multiply: ["$rating", "$reviewCount"] }
            }
        },
        {
            // Sort by the new score, descending
            $sort: { score: -1 }
        },
        {
            // Limit to top 10
            $limit: 10
        }
    ]).toArray();

    return topRatedBooks.map(doc => sanitizeId(doc as Book));
}

/**
 * Retrieves books published within a specific date range.
 */
export async function getBooksByDateRange(startDate: Date, endDate: Date): Promise<Book[]> {
    const { booksCollection } = await getCollections();
    const filteredBooks = await booksCollection.find({
        datePublished: {
            $gte: startDate,
            $lte: endDate
        }
    }).toArray();
    
    return filteredBooks.map(doc => sanitizeId(doc as Book));
}

/**
 * Creates a new book in the database.
 */
export async function createBook(bookData: any): Promise<Book> {
    const { booksCollection } = await getCollections();

    const newBook: Book = {
        id: nanoid(10), // Generate a unique short ID
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        price: Number(bookData.price),
        isbn: bookData.isbn,
        genre: bookData.genre || [],
        tags: bookData.tags || [],
        datePublished: new Date(), // Set publish date to now
        pages: bookData.pages || 0,
        language: bookData.language || "English",
        publisher: bookData.publisher || "Unknown",
        rating: 0,
        reviewCount: 0,
        inStock: bookData.inStock !== undefined ? bookData.inStock : true,
        featured: bookData.featured !== undefined ? bookData.featured : false,
    };

    const result = await booksCollection.insertOne(newBook);
    
    if (!result.insertedId) {
        throw new Error('Failed to create book');
    }

    // Return the inserted book, stripping the MongoDB _id
    return sanitizeId(newBook);
}

/**
 * Retrieves all reviews for a specific book.
 */
export async function getReviewsForBook(bookId: string): Promise<Review[]> {
    const { reviewsCollection } = await getCollections();
    const reviews = await reviewsCollection.find({ bookId: bookId }).toArray();
    return reviews.map(doc => sanitizeId(doc as Review));
}

/**
 * Creates a new review in the database.
 */
export async function createReview(reviewData: any): Promise<Review> {
    const { reviewsCollection } = await getCollections();

    const newReview: Review = {
        id: `review-${nanoid(10)}`, // Generate a unique ID
        bookId: reviewData.bookId,
        author: reviewData.author,
        rating: Number(reviewData.rating),
        title: reviewData.title,
        comment: reviewData.comment,
        timestamp: new Date(), // Set timestamp to now
        verified: reviewData.verified ?? false,
    };

    const result = await reviewsCollection.insertOne(newReview);

    if (!result.insertedId) {
        throw new Error('Failed to create review');
    }

    return sanitizeId(newReview);
}