import { NextResponse } from 'next/server';
import { getFeaturedBooks } from '@/app/lib/data';

export async function GET() {
    try {
        const featuredBooks = await getFeaturedBooks();
        return NextResponse.json(featuredBooks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}