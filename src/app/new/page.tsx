import { prisma } from '@/lib/db';
import NewAndPopularClient from './NewAndPopularClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New & Popular - EduFleex',
    description: 'Discover the latest educational videos and trending content',
};

export default async function NewAndPopularPage() {
    // Fetch recent videos (last 30 days or latest)
    const newVideos = await prisma.video.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    // Fetch popular videos (by views)
    const popularVideos = await prisma.video.findMany({
        include: { category: true },
        orderBy: { views: 'desc' },
        take: 20,
    });

    // Fetch featured videos
    const featuredVideos = await prisma.video.findMany({
        where: { isFeatured: true },
        include: { category: true },
        take: 10,
    });

    // Get top 10 videos by views
    const top10Videos = await prisma.video.findMany({
        include: { category: true },
        orderBy: { views: 'desc' },
        take: 10,
    });

    // Group new videos by subject for variety
    const newBySubject = newVideos.reduce((acc: Record<string, typeof newVideos>, video) => {
        if (!acc[video.subject]) {
            acc[video.subject] = [];
        }
        if (acc[video.subject].length < 6) {
            acc[video.subject].push(video);
        }
        return acc;
    }, {});

    return (
        <NewAndPopularClient
            newVideos={newVideos}
            popularVideos={popularVideos}
            featuredVideos={featuredVideos}
            top10Videos={top10Videos}
            newBySubject={newBySubject}
        />
    );
}
