'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import type { Video as VideoType } from '@prisma/client';

interface VideoRowProps {
    title: string;
    videos: VideoType[];
}

export default function VideoRow({ title, videos }: VideoRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);

    const onScroll = () => {
        if (scrollRef.current) {
            setShowLeft(scrollRef.current.scrollLeft > 0);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-2 py-4 md:space-y-4">
            <h2 className="px-4 text-xl font-bold text-zinc-800 md:px-12 md:text-2xl">
                {title}
            </h2>

            <div className="group relative px-4 md:px-12 md:top-[2rem]">
                {showLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-0 bottom-0 z-40 m-auto flex h-[100%] w-10 cursor-pointer items-center justify-center bg-black/50 opacity-0 transition hover:bg-black/70 group-hover:opacity-100 text-white md:w-12"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onScroll={onScroll}
                    className="netflix-scroll flex items-center gap-2 overflow-x-auto scroll-smooth"
                >
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-40 m-auto flex h-[100%] w-10 cursor-pointer items-center justify-center bg-black/50 opacity-0 transition hover:bg-black/70 group-hover:opacity-100 text-white md:w-12"
                >
                    <ChevronRight className="h-8 w-8" />
                </button>
            </div>
        </div>
    );
}
