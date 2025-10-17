import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex items-center justify-center p-4">
      <main className="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Amana Bookstore Next.js API
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This is the Next.js implementation of the Amana Bookstore API. The following endpoints are available.
        </p>

        <div className="space-y-4 text-left font-mono bg-gray-100 dark:bg-black/20 p-6 rounded-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 text-center font-sans">Available GET Endpoints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <p>
              <Link href="/api/books" className="text-blue-500 hover:underline" prefetch={false}>/api/books</Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400">- Get all books</p>
            <p>
              <Link href="/api/books/1" className="text-blue-500 hover:underline" prefetch={false}>/api/books/[id]</Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400">- Get a single book</p>
            <p>
              <Link href="/api/books/featured" className="text-blue-500 hover:underline" prefetch={false}>/api/books/featured</Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400">- Get featured books</p>
            <p>
              <Link href="/api/books/top-rated" className="text-blue-500 hover:underline" prefetch={false}>/api/books/top-rated</Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400">- Get top 10 rated</p>
            <p>
              <Link href="/api/books/published-between?startDate=2022-01-01&endDate=2022-12-31" className="text-blue-500 hover:underline" prefetch={false}>/api/books/published-between</Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400">- Get by date range</p>
             <p>
              <Link href="/api/reviews/book/1" className="text-blue-500 hover:underline" prefetch={false}>/api/reviews/book/[bookId]</Link>
            </p>
             <p className="text-gray-500 dark:text-gray-400">- Get reviews for a book</p>
          </div>
        </div>

        <div className="mt-8 text-gray-600 dark:text-gray-400">
          <p>POST endpoints for <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">/api/books</code> and <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">/api/reviews</code> are also available and require an API key.</p>
        </div>
      </main>
    </div>
  );
}
