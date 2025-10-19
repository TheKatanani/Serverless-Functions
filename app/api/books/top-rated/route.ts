import { NextResponse } from 'next/server';
import { getTopRatedBooks } from '@/app/lib/data';

export async function GET() {
    try {
        const top10Books = await getTopRatedBooks();
        return NextResponse.json(top10Books);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}