'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, ThumbsUp, Share2 } from 'lucide-react';
import type { Video as VideoType } from '@prisma/client';
import { cn } from '@/lib/utils';

const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
}) as any;

interface VideoPlayerProps {
    video: VideoType;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        // Check if video is in favorites
        const checkFavorite = async () => {
            const res = await fetch(`/api/favorites?userId=default-user`);
            if (res.ok) {
                const favorites = await res.json();
                setIsFavorited(favorites.some((f: any) => f.videoId === video.id));
            }
        };
        checkFavorite();
    }, [video.id]);

    useEffect(() => {
        // Increment view count
        const incrementViews = async () => {
            await fetch(`/api/videos/${video.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ views: video.views + 1 }),
            });
        };
        incrementViews();
    }, [video.id, video.views]);

    const toggleFavorite = async () => {
        const method = isFavorited ? 'DELETE' : 'POST';
        const res = await fetch('/api/favorites', {
            method,
            body: JSON.stringify({ videoId: video.id, userId: 'default-user' }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) setIsFavorited(!isFavorited);
    };

    const handleShare = () => {
        const url = `${window.location.origin}/video/${video.videoId}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div
            className="relative w-full bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Video Player */}
            <div className="relative aspect-video w-full max-h-[85vh]">
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.videoId}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    light={false}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none" />

            {/* Custom Action Buttons - Bottom Right */}
            <div
                className={cn(
                    "absolute bottom-20 right-6 md:bottom-24 md:right-10 flex flex-col gap-3 transition-opacity duration-300",
                    showControls ? "opacity-100" : "opacity-0"
                )}
            >
                <button
                    onClick={toggleFavorite}
                    className={cn(
                        "flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 transition backdrop-blur-sm",
                        isFavorited ? "bg-white/20 border-white text-white" : "bg-black/40 border-white/70 text-white hover:border-white hover:bg-white/20"
                    )}
                    title={isFavorited ? "Remove from My List" : "Add to My List"}
                >
                    <Plus className={cn("h-5 w-5 md:h-6 md:w-6", isFavorited && "rotate-45")} />
                </button>
                <button
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-white/70 bg-black/40 text-white transition hover:border-white hover:bg-white/20 backdrop-blur-sm"
                    title="Like"
                >
                    <ThumbsUp className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                    onClick={handleShare}
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-white/70 bg-black/40 text-white transition hover:border-white hover:bg-white/20 backdrop-blur-sm"
                    title="Share"
                >
                    <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                </button>
            </div>
        </div>
    );
}
