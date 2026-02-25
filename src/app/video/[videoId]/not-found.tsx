import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white px-4">
            <FileQuestion className="h-24 w-24 text-gray-600 mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Video Not Found</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 text-center max-w-md">
                Sorry, we couldn't find the video you're looking for. It may have been removed or doesn't exist.
            </p>
            <Link
                href="/"
                className="rounded bg-white px-8 py-3 text-lg font-bold text-black transition hover:bg-gray-200"
            >
                Back to Home
            </Link>
        </div>
    );
}
