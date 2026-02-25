import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const video = await prisma.video.update({
            where: { id },
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
        return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.video.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}