import { prisma } from '@/lib/db';
import MyListClient from './MyListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My List - EduFleex',
    description: 'Your personal collection of saved educational videos',
};

export default async function MyListPage() {
    const favorites = await prisma.userFavorite.findMany({
        where: { userId: 'default-user' },
        include: {
            video: {
                include: { category: true }
            }
        },
        orderBy: { id: 'desc' }
    });

    const videos = favorites.map(fav => fav.video);

    // Group videos by subject
    const videosBySubject = videos.reduce((acc: Record<string, typeof videos>, video) => {
        if (!acc[video.subject]) {
            acc[video.subject] = [];
        }
        acc[video.subject].push(video);
        return acc;
    }, {});

    // Group videos by grade
    const videosByGrade = videos.reduce((acc: Record<string, typeof videos>, video) => {
        if (!acc[video.grade]) {
            acc[video.grade] = [];
        }
        acc[video.grade].push(video);
        return acc;
    }, {});

    return (
        <MyListClient 
            videos={videos}
            videosBySubject={videosBySubject}
            videosByGrade={videosByGrade}
        />
    );
}
