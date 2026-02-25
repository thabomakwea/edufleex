import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import VideoPlayer from './VideoPlayer';
import VideoRow from '@/components/VideoRow';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ videoId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { videoId } = await params;
    
    const video = await prisma.video.findUnique({
        where: { videoId },
    });

    if (!video) {
        return {
            title: 'Video Not Found',
        };
    }

    return {
        title: `${video.title} - EduFleex`,
        description: video.description,
        openGraph: {
            title: video.title,
            description: video.description,
            images: [video.thumbnail],
        },
    };
}

export default async function VideoPage({ params }: PageProps) {
    const { videoId } = await params;
    
    // Fetch the video by videoId
    const video = await prisma.video.findUnique({
        where: { videoId },
        include: { category: true },
    });

    if (!video) {
        notFound();
    }

    // Fetch related videos from the same subject
    const relatedVideos = await prisma.video.findMany({
        where: {
            subject: video.subject,
            id: { not: video.id },
        },
        take: 12,
        include: { category: true },
    });

    // Fetch more videos from the same grade
    const gradeVideos = await prisma.video.findMany({
        where: {
            grade: video.grade,
            id: { not: video.id },
        },
        take: 12,
        include: { category: true },
    });

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* Back Button */}
            <div className="absolute top-20 left-4 z-50 md:top-24 md:left-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                </Link>
            </div>

            {/* Video Player Section */}
            <VideoPlayer video={video} />

            {/* Video Details Section */}
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{video.title}</h1>
                        
                        <div className="flex items-center gap-4 mb-6 text-sm md:text-base">
                            <span className="text-green-500 font-semibold">{video.views} views</span>
                            <span className="text-gray-400">{video.duration}</span>
                            <span className="px-2 py-1 border border-gray-500 text-gray-300 text-xs">
                                {video.grade}
                            </span>
                        </div>

                        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                            {video.description}
                        </p>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4 text-sm md:text-base">
                        <div>
                            <span className="text-gray-400">Subject: </span>
                            <span className="text-white font-medium">{video.subject}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Grade: </span>
                            <span className="text-white font-medium">{video.grade}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Category: </span>
                            <span className="text-white font-medium">{video.category.name}</span>
                        </div>
                        {video.isFeatured && (
                            <div className="mt-4">
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                    ⭐ FEATURED
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
                <div className="px-4 md:px-8 pb-8">
                    <VideoRow title={`More ${video.subject} Videos`} videos={relatedVideos} />
                </div>
            )}

            {/* Grade Videos */}
            {gradeVideos.length > 0 && (
                <div className="px-4 md:px-8 pb-12">
                    <VideoRow title={`More ${video.grade} Videos`} videos={gradeVideos} />
                </div>
            )}
        </div>
    );
}
