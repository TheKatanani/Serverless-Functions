import fs from 'fs/promises';
import path from 'path';

// Define types for our data for better code quality and safety
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
    datePublished: string;
    pages: number;
    language: string;
    publisher: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    featured: boolean;
}

export interface Review {
    id: string;
    bookId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
    timestamp: string;
    verified: boolean;
}

// Define paths to the JSON data files
const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json');
const reviewsPath = path.join(process.cwd(), 'app', 'data', 'reviews.json');

/**
 * Reads and parses the books data from books.json.
 * @returns {Promise<Book[]>} A promise that resolves to an array of books.
 */
export async function getBooks(): Promise<Book[]> {
    const data = await fs.readFile(booksPath, 'utf8');
    return JSON.parse(data).books;
}

/**
 * Reads and parses the reviews data from reviews.json.
 * @returns {Promise<Review[]>} A promise that resolves to an array of reviews.
 */
export async function getReviews(): Promise<Review[]> {
    const data = await fs.readFile(reviewsPath, 'utf8');
    return JSON.parse(data).reviews;
}

/**
 * Saves the provided array of books to books.json.
 * @param {Book[]} books The array of books to save.
 */
export async function saveBooks(books: Book[]): Promise<void> {
    await fs.writeFile(booksPath, JSON.stringify({ books }, null, 2));
}

/**
 * Saves the provided array of reviews to reviews.json.
 * @param {Review[]} reviews The array of reviews to save.
 */
export async function saveReviews(reviews: Review[]): Promise<void> {
    await fs.writeFile(reviewsPath, JSON.stringify({ reviews }, null, 2));
}
