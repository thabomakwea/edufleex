import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const videos = await prisma.video.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });
    return NextResponse.json(videos);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const video = await prisma.video.create({
            data: {
                title: data.title,
                description: data.description,
                videoId: data.videoId,
                thumbnail: data.thumbnail,
                subject: data.subject,
                grade: data.grade,
                duration: data.duration,
                categoryId: data.categoryId,
                isFeatured: data.isFeatured || false,
            },
            include: { category: true }
        });
        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}
