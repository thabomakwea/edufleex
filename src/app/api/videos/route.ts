import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const limit = searchParams.get('limit');
    const excludeId = searchParams.get('excludeId');

    // Build where clause for filtering
    const where: any = {};
    if (subject) where.subject = subject;
    if (grade) where.grade = grade;
    if (excludeId) where.id = { not: excludeId };

    const videos = await prisma.video.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        take: limit ? parseInt(limit) : undefined,
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
