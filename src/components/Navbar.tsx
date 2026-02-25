'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Bell, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 z-50 w-full px-4 py-4 transition-colors duration-300 md:px-12",
            isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/edufleex3.png"
                            alt="Edufleex"
                            className="h-8 w-32 md:h-10 md:w-40 object-contain"
                        />
                    </Link>

                    <ul className="hidden items-center gap-4 text-sm font-light text-white md:flex">
                        <li><Link href="/" className="transition hover:text-gray-300">Home</Link></li>
                        <li><Link href="/subjects" className="transition hover:text-gray-300">Subjects</Link></li>
                        <li><Link href="/grades" className="transition hover:text-gray-300">Grades</Link></li>
                        <li><Link href="/new" className="transition hover:text-gray-300">New & Popular</Link></li>
                        <li><Link href="/mylist" className="transition hover:text-gray-300">My List</Link></li>
                        <li><Link href="https://studio--studio-7000740348-4a3a4.us-central1.hosted.app/signin" className="transition hover:text-gray-300" target="_blank" rel="noopener noreferrer">Nolwazi</Link></li>
                    </ul>
                </div>

                <div className="flex items-center gap-4 text-white">
                    <button className="transition hover:text-gray-300"><Search className="h-6 w-6" /></button>
                    <Link href="/mylist" className="transition hover:text-gray-300"><Heart className="h-6 w-6" /></Link>
                    <button className="transition hover:text-gray-300"><Bell className="h-6 w-6" /></button>
                    <div className="h-8 w-8 overflow-hidden rounded-md bg-zinc-800">
                        <User className="h-8 w-8 p-1 text-gray-300" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
