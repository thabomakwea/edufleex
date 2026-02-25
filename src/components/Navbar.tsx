'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Bell, User, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    useEffect(() => {
        // Prevent body scroll when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/subjects', label: 'Subjects' },
        { href: '/grades', label: 'Grades' },
        { href: '/new', label: 'New & Popular' },
        { href: '/mylist', label: 'My List' },
        { href: 'https://studio--studio-7000740348-4a3a4.us-central1.hosted.app/signin', label: 'Nolwazi', external: true },
    ];

    return (
        <>
            <nav className={cn(
                "fixed top-0 z-[100] w-full px-4 py-4 transition-colors duration-300 md:px-12",
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

                        {/* Desktop Menu */}
                        <ul className="hidden items-center gap-4 text-sm font-light text-white md:flex">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href} 
                                        className="transition hover:text-gray-300"
                                        {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <button className="transition hover:text-gray-300"><Search className="h-6 w-6" /></button>
                        <Link href="/mylist" className="hidden transition hover:text-gray-300 sm:block"><Heart className="h-6 w-6" /></Link>
                        <button className="hidden transition hover:text-gray-300 sm:block"><Bell className="h-6 w-6" /></button>
                        <div className="hidden h-8 w-8 overflow-hidden rounded-md bg-zinc-800 sm:block">
                            <User className="h-8 w-8 p-1 text-gray-300" />
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden transition hover:text-gray-300" 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-[90] bg-black/80 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Panel */}
            <div className={cn(
                "fixed top-20 right-0 z-[90] h-full w-64 transform bg-black/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:hidden",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col p-6">
                    <ul className="flex flex-col gap-6 text-white">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link 
                                    href={link.href}
                                    className="text-lg font-light transition hover:text-gray-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6">
                        <Link 
                            href="/mylist" 
                            className="flex items-center gap-3 text-white transition hover:text-gray-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Heart className="h-5 w-5" />
                            <span>My List</span>
                        </Link>
                        <button className="flex items-center gap-3 text-white transition hover:text-gray-300">
                            <Bell className="h-5 w-5" />
                            <span>Notifications</span>
                        </button>
                        <button className="flex items-center gap-3 text-white transition hover:text-gray-300">
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
