import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    try {
        const favorites = await prisma.userFavorite.findMany({
            where: { userId },
            include: {
                video: {
                    include: { category: true }
                }
            }
        });

        return NextResponse.json(favorites);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { videoId, userId = 'default-user' } = await request.json();

        const favorite = await prisma.userFavorite.upsert({
            where: {
                userId_videoId: {
                    userId,
                    videoId,
                }
            },
            update: {},
            create: {
                userId,
                videoId,
            }
        });

        return NextResponse.json(favorite);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { videoId, userId = 'default-user' } = await request.json();

        await prisma.userFavorite.delete({
            where: {
                userId_videoId: {
                    userId,
                    videoId,
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }
}
