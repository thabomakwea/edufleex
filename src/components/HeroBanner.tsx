'use client';

import Image from 'next/image';
import { Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Video as VideoType } from '@prisma/client';

interface HeroBannerProps {
    featuredVideo: VideoType;
    episodes?: VideoType[];
}

export default function HeroBanner({ featuredVideo, episodes = [] }: HeroBannerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [imgSrc, setImgSrc] = useState(featuredVideo.thumbnail.replace('/0.jpg', '/maxresdefault.jpg'));
    const [showVideo, setShowVideo] = useState(false);

    // Update image source if the featured video changes
    useEffect(() => {
        setImgSrc(featuredVideo.thumbnail.replace('/0.jpg', '/maxresdefault.jpg'));
        setShowVideo(false); // Reset video state when video changes
    }, [featuredVideo.videoId, featuredVideo.thumbnail]);

    // Try to autoplay video after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowVideo(true);
        }, 1000); // Small delay to ensure component is fully mounted

        return () => clearTimeout(timer);
    }, [featuredVideo.videoId]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            {/* Background Image/Video */}
            <div className="absolute inset-0">
                <Image
                    src={imgSrc}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover brightness-[0.7]"
                    priority
                    onError={() => {
                        // Fallback to regular hqdefault if maxres fails
                        if (imgSrc.includes('maxresdefault')) {
                            setImgSrc(featuredVideo.thumbnail.replace('/0.jpg', '/hqdefault.jpg'));
                        }
                    }}
                />
                
                {/* Autoplay YouTube Video Background */}
                {showVideo && (
                    <div className="absolute inset-0 overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1&mute=1&loop=1&playlist=${featuredVideo.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                            className="absolute inset-0 w-full h-full brightness-[0.7]"
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                border: 'none',
                                pointerEvents: 'none',
                                transform: 'scale(1.5)', // Zoom in to cover black bars
                                transformOrigin: 'center center' // Scale from center
                            }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen={false}
                            frameBorder="0"
                            title="Featured Video Background"
                        />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/50" />
            </div>

            {/* Content */}
            <div className="absolute bottom-[20%] left-4 right-4 z-10 md:left-12 md:top-[18rem]">
                <div className="max-w-xl">
                    <span className="mb-2 inline-block rounded bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">
                        Featured in {featuredVideo.subject}
                    </span>
                    <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl drop-shadow-lg">
                        {featuredVideo.title}
                    </h1>
                    <p className="mb-6 text-lg text-white/90 drop-shadow-md line-clamp-3">
                        {featuredVideo.description}
                    </p>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-md bg-white px-8 py-2 font-bold text-black transition hover:bg-white/80">
                            <Play className="h-6 w-6 fill-current" /> Play
                        </button>
                        <button className="flex items-center gap-2 rounded-md bg-gray-500/70 px-8 py-2 font-bold text-white transition hover:bg-gray-500/50">
                            <Info className="h-6 w-6" /> More Info
                        </button>
                    </div>
                </div>

                {/* Episodes Section in Hero */}
                {episodes.length > 0 && (
                    <div className="mt-12 hidden md:block">
                        <h3 className="mb-4 text-xl font-semibold text-white">Episodes</h3>
                        <div className="group relative">
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-[-40px] top-1/2 z-20 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 hover:scale-125 text-white"
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </button>

                            <div
                                ref={scrollRef}
                                className="netflix-scroll flex gap-4 overflow-x-auto pb-4"
                            >
                                {episodes.map((episode) => (
                                    <div key={episode.id} className="relative min-w-[200px] cursor-pointer transition hover:scale-105">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border border-white/20">
                                            <Image
                                                src={episode.thumbnail}
                                                alt={episode.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                <Play className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs font-medium text-white line-clamp-1">{episode.title}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-[-40px] top-1/2 z-20 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 hover:scale-125 text-white"
                            >
                                <ChevronRight className="h-10 w-10" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
