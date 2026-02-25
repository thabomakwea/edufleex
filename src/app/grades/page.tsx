import { prisma } from '@/lib/db';
import Link from 'next/link';
import { GraduationCap, BookOpen, Users, TrendingUp } from 'lucide-react';
import VideoRow from '@/components/VideoRow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Browse by Grade - EduFleex',
    description: 'Explore educational videos organized by grade level',
};

export default async function GradesPage() {
    const videos = await prisma.video.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });

    // Get unique grades and count videos per grade
    const gradeStats = videos.reduce((acc: Record<string, number>, video) => {
        acc[video.grade] = (acc[video.grade] || 0) + 1;
        return acc;
    }, {});

    const grades = Object.keys(gradeStats).sort();

    // Grade color schemes
    const gradeColors = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-yellow-500 to-orange-500',
        'from-teal-500 to-green-500',
        'from-pink-500 to-rose-500',
        'from-cyan-500 to-blue-500',
        'from-lime-500 to-green-500',
    ];

    // Get featured videos for preview
    const featuredVideos = videos.filter(v => v.isFeatured).slice(0, 12);

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4 py-20 md:px-8 md:py-32">
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <div className="flex items-center gap-3 mb-6">
                        <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-yellow-400" />
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                            Browse by Grade
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">
                        Find educational content tailored to your grade level. From elementary to high school, 
                        explore videos designed to help you learn and succeed.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                        <BookOpen className="h-8 w-8 text-blue-400 mb-3" />
                        <div className="text-3xl font-bold">{grades.length}</div>
                        <div className="text-sm text-gray-400">Grade Levels</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                        <Users className="h-8 w-8 text-purple-400 mb-3" />
                        <div className="text-3xl font-bold">{videos.length}</div>
                        <div className="text-sm text-gray-400">Total Videos</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                        <TrendingUp className="h-8 w-8 text-green-400 mb-3" />
                        <div className="text-3xl font-bold">{Object.keys(gradeStats).reduce((acc, grade) => acc + gradeStats[grade], 0)}</div>
                        <div className="text-sm text-gray-400">Lessons</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
                        <GraduationCap className="h-8 w-8 text-orange-400 mb-3" />
                        <div className="text-3xl font-bold">All</div>
                        <div className="text-sm text-gray-400">Grade Levels</div>
                    </div>
                </div>
            </div>

            {/* Grades Grid */}
            <div className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Select Your Grade</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {grades.map((grade, index) => (
                        <Link
                            key={grade}
                            href={`/grades/${encodeURIComponent(grade)}`}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradeColors[index % gradeColors.length]} opacity-80 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-white/90" />
                                    <div className="text-sm md:text-base font-bold text-white/90 bg-white/20 px-3 py-1 rounded-full">
                                        {gradeStats[grade]} videos
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {grade}
                                </h3>
                                <p className="text-sm md:text-base text-white/80">
                                    Explore lessons →
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Videos Section */}
            {featuredVideos.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
                    <VideoRow title="Featured Content" videos={featuredVideos} />
                </div>
            )}
        </div>
    );
}
