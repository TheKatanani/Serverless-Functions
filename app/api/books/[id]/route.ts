import { NextResponse } from 'next/server';
import { getBookById } from '@/app/lib/data';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const paramsResolved = await params;
        const book = await getBookById(paramsResolved.id);
        
        if (book) {
            return NextResponse.json(book);
        } else {
            return NextResponse.json({ message: `Book with ID ${paramsResolved.id} not found` }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error reading books data' }, { status: 500 });
    }
}