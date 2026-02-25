import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white px-4">
            <GraduationCap className="h-24 w-24 text-gray-600 mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Grade Not Found</h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 text-center max-w-md">
                Sorry, we couldn't find videos for this grade level. Check out other grades available.
            </p>
            <Link
                href="/grades"
                className="rounded bg-white px-8 py-3 text-lg font-bold text-black transition hover:bg-gray-200"
            >
                Browse Grades
            </Link>
        </div>
    );
}
