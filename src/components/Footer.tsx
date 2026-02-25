'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black py-12 px-4 text-gray-400 md:px-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex gap-6 text-white">
                    <Facebook className="h-6 w-6 cursor-pointer hover:text-gray-300" />
                    <Instagram className="h-6 w-6 cursor-pointer hover:text-gray-300" />
                    <Twitter className="h-6 w-6 cursor-pointer hover:text-gray-300" />
                    <Youtube className="h-6 w-6 cursor-pointer hover:text-gray-300" />
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-2">
                        <Link href="#" className="hover:underline">Audio Description</Link>
                        <Link href="#" className="hover:underline">Help Centre</Link>
                        <Link href="#" className="hover:underline">Gift Cards</Link>
                        <Link href="#" className="hover:underline">Media Centre</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link href="#" className="hover:underline">Investor Relations</Link>
                        <Link href="#" className="hover:underline">Jobs</Link>
                        <Link href="#" className="hover:underline">Terms of Use</Link>
                        <Link href="#" className="hover:underline">Privacy</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link href="#" className="hover:underline">Legal Notices</Link>
                        <Link href="#" className="hover:underline">Cookie Preferences</Link>
                        <Link href="#" className="hover:underline">Corporate Information</Link>
                        <Link href="#" className="hover:underline">Contact Us</Link>
                    </div>
                    <div className="flex flex-col gap-4 text-white">
                        <p className="text-sm font-semibold uppercase tracking-wider">In Partnership With</p>
                        <div className="flex flex-col gap-2 opacity-80">
                            <p className="text-sm">Department of Education</p>
                            <p className="text-sm">SABC Education</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-zinc-800 pt-8 text-xs">
                    <p>© 2026 Edufleex Education. All rights reserved.</p>
                    <p className="mt-1">Empowering the youth of South Africa through learning.</p>
                </div>
            </div>
        </footer>
    );
}
