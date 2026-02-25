'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Grid3x3, List, Filter, SortAsc, Play, Trash2, BookOpen, GraduationCap, Clock, TrendingUp, Search } from 'lucide-react';
import type { Video as VideoType, Category } from '@prisma/client';
import VideoCard from '@/components/VideoCard';
import { cn } from '@/lib/utils';

type VideoWithCategory = VideoType & { category: Category };

interface MyListClientProps {
    videos: VideoWithCategory[];
    videosBySubject: Record<string, VideoWithCategory[]>;
    videosByGrade: Record<string, VideoWithCategory[]>;
}

export default function MyListClient({ videos, videosBySubject, videosByGrade }: MyListClientProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'recent' | 'title' | 'subject'>('recent');
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const getSortedVideos = () => {
        let filtered = filterSubject === 'all' ? videos : videos.filter(v => v.subject === filterSubject);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(v =>
                v.title.toLowerCase().includes(q) ||
                v.description.toLowerCase().includes(q) ||
                v.subject.toLowerCase().includes(q)
            );
        }

        switch (sortBy) {
            case 'title':
                return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
            case 'subject':
                return [...filtered].sort((a, b) => a.subject.localeCompare(b.subject));
            default:
                return filtered;
        }
    };

    const sortedVideos = getSortedVideos();
    const subjects = Object.keys(videosBySubject).sort();
    const totalDuration = videos.reduce((acc, v) => {
        const parts = v.duration.split(':');
        if (parts.length === 2) {
            return acc + parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return acc + (parseInt(v.duration) || 0);
    }, 0);
    const totalMinutes = Math.floor(totalDuration / 60);

    // Empty state
    if (videos.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-20">
                    <div className="relative mb-8">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100">
                            <Heart className="h-14 w-14 text-gray-300" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">Your List is Empty</h1>
                    <p className="text-gray-500 text-base md:text-lg mb-8 text-center max-w-md">
                        Start building your personal library. Click the + icon on any video to save it here.
                    </p>
                    <Link
                        href="/"
                        className="rounded-full bg-black px-8 py-3 text-base font-semibold text-white transition hover:bg-gray-800"
                    >
                        Explore Videos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b border-gray-100 bg-white pt-24 pb-8 px-4 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Your Collection</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                My List
                            </h1>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900 leading-none">{videos.length}</p>
                                    <p className="text-xs text-gray-400">Videos</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                                    <GraduationCap className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900 leading-none">{subjects.length}</p>
                                    <p className="text-xs text-gray-400">Subjects</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-900 leading-none">{totalMinutes}m</p>
                                    <p className="text-xs text-gray-400">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Left: Search + View Mode */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search your list..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 md:w-64 rounded-lg bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition"
                                />
                            </div>
                            <div className="flex items-center rounded-lg bg-gray-100 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-1.5 rounded-md transition-all",
                                        viewMode === 'grid' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-1.5 rounded-md transition-all",
                                        viewMode === 'list' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Filters */}
                        <div className="flex items-center gap-3">
                            <select
                                value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                className="rounded-lg bg-gray-50 text-gray-700 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="rounded-lg bg-gray-50 text-gray-700 px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                            >
                                <option value="recent">Recently Added</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="subject">Subject</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(filterSubject !== 'all' || searchQuery.trim()) && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-gray-400">
                                {sortedVideos.length} {sortedVideos.length === 1 ? 'result' : 'results'}
                            </span>
                            {filterSubject !== 'all' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                    {filterSubject}
                                    <button onClick={() => setFilterSubject('all')} className="ml-1 text-gray-400 hover:text-gray-700">×</button>
                                </span>
                            )}
                            {searchQuery.trim() && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                    &quot;{searchQuery}&quot;
                                    <button onClick={() => setSearchQuery('')} className="ml-1 text-gray-400 hover:text-gray-700">×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
                {sortedVideos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Search className="h-12 w-12 text-gray-200 mb-4" />
                        <p className="text-lg font-medium text-gray-400">No matching videos found</p>
                        <p className="text-sm text-gray-300 mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {sortedVideos.map((video) => (
                            <div key={video.id}>
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sortedVideos.map((video) => (
                            <ListVideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </div>

            {/* Browse by Subject */}
            {filterSubject === 'all' && !searchQuery.trim() && (
                <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by Subject</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => setFilterSubject(subject)}
                                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-gray-300 hover:shadow-md"
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{subject}</h3>
                                    <p className="text-sm text-gray-400 mt-0.5">{videosBySubject[subject].length} videos</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// List View Card
function ListVideoCard({ video }: { video: VideoWithCategory }) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        await fetch('/api/favorites', {
            method: 'DELETE',
            body: JSON.stringify({ videoId: video.id, userId: 'default-user' }),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.reload();
    };

    return (
        <div className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-gray-200 hover:shadow-sm">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-40 h-24 md:w-52 md:h-30 rounded-lg overflow-hidden">
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-10 w-10 text-white fill-current drop-shadow-lg" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                    {video.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {video.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {video.subject}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {video.grade}
                    </span>
                    <span className="text-xs text-gray-400">{video.duration}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center">
                <button
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Remove from list"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
