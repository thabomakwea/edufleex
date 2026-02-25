'use client';

import Image from 'next/image';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import type { Video as VideoType } from '@prisma/client';
import { useState, useRef, useEffect } from 'react';
import DetailModal from './DetailModal';

interface VideoCardProps {
    video: VideoType;
}

export default function VideoCard({ video }: VideoCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [isModalHovered, setIsModalHovered] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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

    // Update hover state based on card and modal hover states
    useEffect(() => {
        setIsHovered(isCardHovered || isModalHovered);
    }, [isCardHovered, isModalHovered]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
        };
    }, [hoverTimeout]);

    const toggleFavorite = async () => {
        const method = isFavorited ? 'DELETE' : 'POST';
        const res = await fetch('/api/favorites', {
            method,
            body: JSON.stringify({ videoId: video.id, userId: 'default-user' }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) setIsFavorited(!isFavorited);
    };

    const handleCardMouseEnter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setIsCardHovered(true);
    };

    const handleCardMouseLeave = () => {
        setIsCardHovered(false);
        // Delay hiding to allow mouse to move to modal
        // setHoverTimeout(setTimeout(() => {
        if (!isModalHovered) {
            setIsHovered(false);
        }
        // }, 1800));
    };

    const handleModalMouseEnter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setIsModalHovered(true);
    };

    const handleModalMouseLeave = () => {
        setIsModalHovered(false);
        // Delay hiding to allow mouse to move back to card
        // setHoverTimeout(setTimeout(() => {
        if (!isCardHovered) {
            setIsHovered(false);
        }
        // }, 1800));
    };

    return (
        <>
            <div
                ref={cardRef}
                className="relative min-w-[160px] h-28 cursor-pointer transition-transform duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-110 z-10"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => setIsModalOpen(true)}
            >
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 160px, 260px"
                    className="rounded-sm object-cover md:rounded"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-2 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-black/40 text-white rounded">
                    <p className="text-xs font-bold leading-tight line-clamp-2 md:text-sm">{video.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <Play className="h-4 w-4 fill-current text-white" />
                        <span className="text-[10px] font-medium">{video.duration}</span>
                    </div>
                </div>
            </div>

            {/* Hover Tooltip Modal */}
            {isHovered && (
                <div
                    ref={modalRef}
                    className="absolute z-[300] w-[280px] md:w-[320px] bg-white rounded-md shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 top-[-100px] md:"
                    style={{
                        // top: cardRef.current ? Math.max(10, cardRef.current.getBoundingClientRect().top - 320) : 0,
                        left: cardRef.current ? Math.min(
                            window.innerWidth - 340, // Keep within right edge
                            Math.max(10, cardRef.current.getBoundingClientRect().left - 30) // Keep within left edge
                        ) : 0,
                    }}
                    onMouseEnter={handleModalMouseEnter}
                    onMouseLeave={handleModalMouseLeave}
                >
                    {/* Video Preview */}
                    <div className="relative aspect-video w-full bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
                            className="w-full h-full"
                            style={{ border: 'none' }}
                            allow="autoplay; encrypted-media"
                            title={`${video.title} preview`}
                        />

                        {/* Action Buttons Overlay at Bottom of Video */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between" style={{
                            padding: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '1rem',
                            bottom: '0.3rem',
                        }}>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsModalOpen(true);
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite();
                                    }}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${isFavorited
                                            ? 'bg-white border-white text-black'
                                            : 'border-white/70 text-white hover:border-white'
                                        }`}
                                >
                                    <Plus className={`h-4 w-4 ${isFavorited ? 'rotate-45' : ''}`} />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white">
                                    <ThumbsUp className="h-4 w-4" />
                                </button>
                            </div>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white">
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-3 py-3 bg-white">
                        {/* Metadata Row */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-green-600">98% Match</span>
                            <span className="text-xs px-1.5 py-0.5 border border-gray-400 text-gray-700 font-medium">
                                {video.grade}
                            </span>
                            <span className="text-xs text-gray-700">{video.duration}</span>
                            <span className="text-xs px-1 py-0.5 border border-gray-400 text-gray-700 font-medium">
                                HD
                            </span>
                        </div>

                        {/* Genre Tags */}
                        <div className="text-xs text-gray-800 font-medium">
                            {video.subject} • {video.grade} • Education
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <DetailModal video={video} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
}
