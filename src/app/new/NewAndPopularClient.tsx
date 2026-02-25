'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, TrendingUp, Sparkles, Flame, Crown, Clock, Eye } from 'lucide-react';
import type { Video as VideoType, Category } from '@prisma/client';
import VideoRow from '@/components/VideoRow';
import { cn } from '@/lib/utils';

type VideoWithCategory = VideoType & { category: Category };

interface NewAndPopularClientProps {
    newVideos: VideoWithCategory[];
    popularVideos: VideoWithCategory[];
    featuredVideos: VideoWithCategory[];
    top10Videos: VideoWithCategory[];
    newBySubject: Record<string, VideoWithCategory[]>;
}

export default function NewAndPopularClient({
    newVideos,
    popularVideos,
    featuredVideos,
    top10Videos,
    newBySubject,
}: NewAndPopularClientProps) {
    const [activeTab, setActiveTab] = useState<'new' | 'popular'>('new');

    const tabs = [
        { id: 'new' as const, label: 'New Releases', icon: Sparkles },
        { id: 'popular' as const, label: 'Trending Now', icon: TrendingUp },
    ];

    const heroVideo = activeTab === 'new' ? newVideos[0] : popularVideos[0];

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* Hero Section */}
            <div className="relative h-[85vh] overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroVideo?.thumbnail})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-32 md:px-8 md:pb-40">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="flex items-center gap-3 mb-4">
                            {activeTab === 'new' ? (
                                <>
                                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-yellow-400 animate-pulse" />
                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text text-lg md:text-xl font-bold uppercase tracking-wider">
                                        New Release
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Flame className="h-8 w-8 md:h-10 md:w-10 text-red-500 animate-pulse" />
                                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text text-lg md:text-xl font-bold uppercase tracking-wider">
                                        Trending Now
                                    </span>
                                </>
                            )}
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-xl max-w-3xl leading-tight">
                            {heroVideo?.title}
                        </h1>
                        
                        <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl drop-shadow-lg line-clamp-3">
                            {heroVideo?.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                                {heroVideo?.grade}
                            </span>
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                                {heroVideo?.subject}
                            </span>
                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                                {heroVideo?.duration}
                            </span>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-sm font-medium">
                                <Eye className="h-4 w-4" />
                                <span>{heroVideo?.views} views</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href={`/video/${heroVideo?.videoId}`}
                                className="flex items-center gap-3 rounded bg-white px-8 py-3 text-lg font-bold text-black transition hover:bg-gray-200"
                            >
                                <Play className="h-6 w-6 fill-current" />
                                <span>Play Now</span>
                            </Link>
                            <button className="flex items-center gap-3 rounded bg-white/20 backdrop-blur-sm px-8 py-3 text-lg font-bold text-white transition hover:bg-white/30">
                                <span>More Info</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="sticky top-16 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="flex gap-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative flex items-center gap-2 py-4 text-base md:text-lg font-semibold transition-colors",
                                        activeTab === tab.id
                                            ? "text-white"
                                            : "text-gray-400 hover:text-gray-200"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
                {activeTab === 'new' ? (
                    <>
                        {/* Top 10 New Releases */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Crown className="h-6 w-6 md:h-7 md:w-7 text-yellow-400" />
                                <h2 className="text-2xl md:text-3xl font-bold">Latest Additions</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {newVideos.slice(0, 9).map((video, index) => (
                                    <Link
                                        key={video.id}
                                        href={`/video/${video.videoId}`}
                                        className="group relative overflow-hidden rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all hover:scale-[1.02]"
                                    >
                                        <div className="flex gap-4 p-4">
                                            {/* Number Badge */}
                                            <div className="flex-shrink-0 text-6xl font-black text-gray-800 group-hover:text-gray-700 transition-colors" style={{
                                                textShadow: '-2px -2px 0 #404040, 2px -2px 0 #404040, -2px 2px 0 #404040, 2px 2px 0 #404040'
                                            }}>
                                                {index + 1}
                                            </div>
                                            
                                            {/* Thumbnail */}
                                            <div className="relative flex-shrink-0 w-28 h-16 md:w-32 md:h-18 rounded overflow-hidden">
                                                <Image
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Play className="h-8 w-8 text-white fill-current" />
                                                </div>
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-1">
                                                    {video.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                                    <span>{video.grade}</span>
                                                    <span>•</span>
                                                    <span>{video.subject}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-green-500">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{video.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* New Videos by Subject */}
                        {Object.entries(newBySubject).map(([subject, videos]) => (
                            <div key={subject} className="mb-8">
                                <VideoRow 
                                    title={`New in ${subject}`} 
                                    videos={videos} 
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {/* Top 10 Popular */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Crown className="h-6 w-6 md:h-7 md:w-7 text-red-500" />
                                <h2 className="text-2xl md:text-3xl font-bold">Top 10 Most Watched</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {top10Videos.map((video, index) => (
                                    <Link
                                        key={video.id}
                                        href={`/video/${video.videoId}`}
                                        className="group relative overflow-hidden rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all hover:scale-[1.02]"
                                    >
                                        <div className="flex gap-4 p-4">
                                            {/* Number Badge */}
                                            <div className="flex-shrink-0 text-6xl font-black text-gray-800 group-hover:text-red-900 transition-colors" style={{
                                                textShadow: '-2px -2px 0 #7f1d1d, 2px -2px 0 #7f1d1d, -2px 2px 0 #7f1d1d, 2px 2px 0 #7f1d1d'
                                            }}>
                                                {index + 1}
                                            </div>
                                            
                                            {/* Thumbnail */}
                                            <div className="relative flex-shrink-0 w-28 h-16 md:w-32 md:h-18 rounded overflow-hidden">
                                                <Image
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Play className="h-8 w-8 text-white fill-current" />
                                                </div>
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-1">
                                                    {video.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                                    <span>{video.grade}</span>
                                                    <span>•</span>
                                                    <span>{video.subject}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                                                    <Flame className="h-3 w-3" />
                                                    <span>{video.views} views</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* More Popular Content */}
                        <div className="mb-8">
                            <VideoRow 
                                title="Trending This Week" 
                                videos={popularVideos.slice(0, 12)} 
                            />
                        </div>
                        
                        {featuredVideos.length > 0 && (
                            <div className="mb-8">
                                <VideoRow 
                                    title="Editor's Picks" 
                                    videos={featuredVideos} 
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
