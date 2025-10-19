// We use .mjs to allow top-level await and ES module imports
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error('MONGODB_URI or MONGODB_DB not found in .env.local');
}

// Helper to get correct file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const booksPath = path.join(projectRoot, 'app', 'data', 'books.json');
const reviewsPath = path.join(projectRoot, 'app', 'data', 'reviews.json');

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB for seeding...');
    const db = client.db(dbName);

    // --- Seed Books ---
    console.log('Reading books.json...');
    const booksData = JSON.parse(await readFile(booksPath, 'utf8'));
    const booksToSeed = booksData.books.map(book => ({
      ...book,
      // Convert date string to a real BSON Date object for correct querying
      datePublished: new Date(book.datePublished),
      // We can also ensure price is a number, just in case
      price: Number(book.price),
    }));

    // Clear existing books and insert new ones
    const booksCollection = db.collection('books');
    await booksCollection.deleteMany({});
    console.log('Cleared "books" collection.');
    const booksResult = await booksCollection.insertMany(booksToSeed);
    console.log(`Successfully inserted ${booksResult.insertedCount} books.`);

    // --- Seed Reviews ---
    console.log('Reading reviews.json...');
    const reviewsData = JSON.parse(await readFile(reviewsPath, 'utf8'));
    const reviewsToSeed = reviewsData.reviews.map(review => ({
      ...review,
      // Convert timestamp string to a real BSON Date object
      timestamp: new Date(review.timestamp),
      rating: Number(review.rating),
    }));

    // Clear existing reviews and insert new ones
    const reviewsCollection = db.collection('reviews');
    await reviewsCollection.deleteMany({});
    console.log('Cleared "reviews" collection.');
    const reviewsResult = await reviewsCollection.insertMany(reviewsToSeed);
    console.log(`Successfully inserted ${reviewsResult.insertedCount} reviews.`);

    console.log('\nDatabase seeding complete! ✅');

  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seedDatabase();