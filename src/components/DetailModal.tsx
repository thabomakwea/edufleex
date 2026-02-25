'use client';

import { X, Play, Plus, ThumbsUp, Volume2, VolumeX, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useState, useEffect } from 'react';
import type { Video as VideoType } from '@prisma/client';
import { cn } from '@/lib/utils';

interface DetailModalProps {
    video: VideoType;
    isOpen: boolean;
    onClose: () => void;
}

export default function DetailModal({ video, isOpen, onClose }: DetailModalProps) {
    const [muted, setMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        // Check if video is in favorites
        const checkFavorite = async () => {
            const res = await fetch(`/api/favorites?userId=default-user`);
            if (res.ok) {
                const favorites = await res.json();
                setIsFavorited(favorites.some((f: any) => f.videoId === video.id));
            }
        };
        if (isOpen) checkFavorite();
    }, [isOpen, video.id]);

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

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-black/95 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative mx-auto w-full max-w-5xl overflow-y-auto rounded-lg bg-[#181818] shadow-2xl my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Video Player Section with Overlay */}
                        <div className="relative w-full bg-black">
                            <div className="aspect-video w-full">
                                <ReactPlayer
                                    src={`https://www.youtube.com/watch?v=${video.videoId}`}
                                    width="100%"
                                    height="100%"
                                    playing={isPlaying}
                                    muted={muted}
                                    controls={false}
                                    className="absolute inset-0"
                                />
                            </div>
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                            
                            {/* Content Overlay on Video */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <h1 className="text-[2rem] md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-xl">
                                    {video.title}
                                </h1>
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="flex items-center gap-3 rounded bg-white px-8 py-3 text-lg font-bold text-black transition hover:bg-gray-200"
                                    >
                                        <Play className="h-6 w-6 fill-current" /> Play
                                    </button>
                                    <button
                                        onClick={toggleFavorite}
                                        className={cn(
                                            "flex h-11 w-11 items-center justify-center rounded-full border-2 transition",
                                            isFavorited ? "bg-white/20 border-white/70 text-white" : "border-white/70 text-white hover:border-white"
                                        )}
                                    >
                                        <Plus className={cn("h-6 w-6", isFavorited && "rotate-45")} />
                                    </button>
                                    <button
                                        onClick={() => setIsLogged(!isLogged)}
                                        className={cn(
                                            "flex h-11 w-11 items-center justify-center rounded-full border-2 transition",
                                            isLogged ? "bg-white/20 border-white/70 text-white" : "border-white/70 text-white hover:border-white"
                                        )}
                                    >
                                        <ThumbsUp className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => setMuted(!muted)}
                                        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 text-white transition hover:border-white"
                                    >
                                        {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-8 md:px-12 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="font-bold text-green-500">98% Match</span>
                                        <span className="text-gray-400">2025</span>
                                        <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-400">
                                            {video.grade}
                                        </span>
                                        <span className="text-gray-400">{video.duration}</span>
                                        <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-400">
                                            HD
                                        </span>
                                    </div>

                                    <p className="text-base text-white leading-relaxed">
                                        {video.description}
                                    </p>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <p className="text-gray-400">
                                        <span className="text-gray-500">Genres : </span>
                                        <span className="text-white">{video.subject}, Education, Learning</span>
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="text-gray-500">Available in : </span>
                                        <span className="text-white">English</span>
                                    </p>
                                </div>
                            </div>

                            {/* More Like This Section */}
                            <div className="mt-12 border-t border-gray-700 pt-8">
                                <h3 className="mb-6 text-2xl font-bold text-white">More Like This</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Placeholder for similar videos */}
                                    <div className="relative aspect-video rounded bg-gray-800 animate-pulse">
                                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                                            15m
                                        </div>
                                    </div>
                                    <div className="relative aspect-video rounded bg-gray-800 animate-pulse">
                                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                                            55m
                                        </div>
                                    </div>
                                    <div className="relative aspect-video rounded bg-gray-800 animate-pulse">
                                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs text-white rounded">
                                            6m
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
