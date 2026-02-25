import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.userFavorite.deleteMany({})
    await prisma.video.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.series.deleteMany({})

    // Create Categories
    const categories = [
        { name: 'Mathematics' },
        { name: 'Science' },
        { name: 'Biology' },
        { name: 'Geography' },
        { name: 'History' },
        { name: 'English' },
    ]

    for (const cat of categories) {
        await prisma.category.create({
            data: cat,
        })
    }

    const mathCat = await prisma.category.findUnique({ where: { name: 'Mathematics' } })
    const scienceCat = await prisma.category.findUnique({ where: { name: 'Science' } })
    const biologyCat = await prisma.category.findUnique({ where: { name: 'Biology' } })
    const geoCat = await prisma.category.findUnique({ where: { name: 'Geography' } })

    if (!mathCat || !scienceCat || !biologyCat || !geoCat) return

    // Create some videos
    const videos = [
        {
            title: 'Algebra Basics',
            description: 'Learn the foundations of Algebra. Perfect for Grade 8 and 9 students.',
            thumbnail: 'https://img.youtube.com/vi/fk0wyv1HpFg/0.jpg',
            videoId: 'fk0wyv1HpFg',
            subject: 'Mathematics',
            grade: 'Grade 8',
            duration: '10:30',
            views: 15200,
            isFeatured: true,
            categoryId: mathCat.id,
        },
        {
            title: 'Introduction to Physics',
            description: 'What is physics? Explore the laws of the universe.',
            thumbnail: 'https://img.youtube.com/vi/b1t41Q3xRM8/0.jpg',
            videoId: 'b1t41Q3xRM8',
            subject: 'Science',
            grade: 'Grade 10',
            duration: '12:45',
            views: 8500,
            isFeatured: false,
            categoryId: scienceCat.id,
        },
        {
            title: 'Chemical Reactions',
            description: 'Understanding atoms and how they interact in chemistry.',
            thumbnail: 'https://img.youtube.com/vi/T6FpTInMvU4/0.jpg',
            videoId: 'T6FpTInMvU4',
            subject: 'Science',
            grade: 'Grade 11',
            duration: '15:20',
            views: 12000,
            isFeatured: true,
            categoryId: scienceCat.id,
        },
        {
            title: 'The Human Heart',
            description: 'How the heart works and pumps blood throughout the body.',
            thumbnail: 'https://img.youtube.com/vi/7XaftdE_h60/0.jpg',
            videoId: '7XaftdE_h60',
            subject: 'Biology',
            grade: 'Grade 9',
            duration: '08:15',
            views: 25000,
            isFeatured: false,
            categoryId: biologyCat.id,
        },
        {
            title: 'Plate Tectonics',
            description: 'Explore the movement of the Earth\'s crust and the formation of mountains.',
            thumbnail: 'https://img.youtube.com/vi/RA2-Vc4PHA0/0.jpg',
            videoId: 'RA2-Vc4PHA0',
            subject: 'Geography',
            grade: 'Grade 12',
            duration: '09:50',
            views: 5400,
            isFeatured: false,
            categoryId: geoCat.id,
        },
        {
            title: 'Pythagorean Theorem',
            description: 'Master the theorem for right-angled triangles.',
            thumbnail: 'https://img.youtube.com/vi/WqhlG3VTe_M/0.jpg',
            videoId: 'WqhlG3VTe_M',
            subject: 'Mathematics',
            grade: 'Grade 9',
            duration: '07:40',
            views: 31000,
            isFeatured: false,
            categoryId: mathCat.id,
        },
        {
            title: 'Evolution for Beginners',
            description: 'Understanding the theory of evolution by natural selection.',
            thumbnail: 'https://img.youtube.com/vi/hOfRN0KihOU/0.jpg',
            videoId: 'hOfRN0KihOU',
            subject: 'Biology',
            grade: 'Grade 11',
            duration: '14:10',
            views: 19000,
            isFeatured: false,
            categoryId: biologyCat.id,
        },
        {
            title: 'The Great Depression',
            description: 'A deep dive into the economic crisis of the 1930s.',
            thumbnail: 'https://img.youtube.com/vi/GCQfMWAikyU/0.jpg',
            videoId: 'GCQfMWAikyU',
            subject: 'History',
            grade: 'Grade 11',
            duration: '20:00',
            views: 4500,
            isFeatured: false,
            categoryId: (await prisma.category.findUnique({ where: { name: 'History' } }))?.id || '',
        }
    ]

    for (const video of videos) {
        if (video.categoryId) {
            await prisma.video.create({
                data: video,
            })
        }
    }

    console.log('Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
