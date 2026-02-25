import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
    const videos = await prisma.video.findMany({
        select: {
            id: true,
            title: true,
            isFeatured: true,
            videoId: true
        }
    })
    console.log('--- VIDEO LIST START ---')
    videos.forEach(v => {
        console.log(`${v.title} | Featured: ${v.isFeatured} | ID: ${v.videoId}`)
    })
    console.log('--- VIDEO LIST END ---')
    await prisma.$disconnect()
}

check()
