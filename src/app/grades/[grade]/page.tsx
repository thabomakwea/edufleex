import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import VideoRow from '@/components/VideoRow';
import { ArrowLeft, GraduationCap, BookOpen, Video } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{ grade: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { grade } = await params;
    const decodedGrade = decodeURIComponent(grade);
    
    return {
        title: `${decodedGrade} Videos - EduFleex`,
        description: `Explore educational videos for ${decodedGrade}`,
    };
}

export default async function GradePage({ params }: PageProps) {
    const { grade } = await params;
    const decodedGrade = decodeURIComponent(grade);
    
    // Fetch videos for this grade
    const videos = await prisma.video.findMany({
        where: { grade: decodedGrade },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });

    if (videos.length === 0) {
        notFound();
    }

    // Group videos by subject
    const videosBySubject = videos.reduce((acc: Record<string, typeof videos>, video) => {
        if (!acc[video.subject]) {
            acc[video.subject] = [];
        }
        acc[video.subject].push(video);
        return acc;
    }, {});

    const subjects = Object.keys(videosBySubject).sort();

    // Get featured video for hero
    const featuredVideo = videos.find(v => v.isFeatured) || videos[0];

    // Subject color schemes for tags
    const subjectColors: Record<string, string> = {
        'Mathematics': 'bg-blue-500',
        'Science': 'bg-green-500',
        'English': 'bg-purple-500',
        'History': 'bg-orange-500',
        'Geography': 'bg-teal-500',
        'Physics': 'bg-indigo-500',
        'Chemistry': 'bg-pink-500',
        'Biology': 'bg-emerald-500',
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-20 md:px-8 md:pb-32">
                    <Link
                        href="/grades"
                        className="absolute top-20 left-4 md:top-24 md:left-8 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Grades</span>
                    </Link>

                    <div className="mx-auto w-full max-w-6xl">
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-yellow-400" />
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-xl">
                                {decodedGrade}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl drop-shadow-lg">
                            Discover {videos.length} educational videos across {subjects.length} subjects 
                            tailored for {decodedGrade} students.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Video className="h-5 w-5 text-blue-400" />
                                <span className="text-sm font-medium">{videos.length} Videos</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <BookOpen className="h-5 w-5 text-green-400" />
                                <span className="text-sm font-medium">{subjects.length} Subjects</span>
                            </div>
                        </div>

                        {/* Subject Tags */}
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => (
                                <Link
                                    key={subject}
                                    href={`/subjects/${encodeURIComponent(subject)}`}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${
                                        subjectColors[subject] || 'bg-gray-500'
                                    } hover:opacity-80 transition`}
                                >
                                    {subject}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Videos by Subject */}
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
                {subjects.map((subject) => (
                    <div key={subject} className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold">{subject}</h2>
                            <Link
                                href={`/subjects/${encodeURIComponent(subject)}`}
                                className="text-sm text-gray-400 hover:text-white transition"
                            >
                                View All →
                            </Link>
                        </div>
                        <VideoRow title="" videos={videosBySubject[subject]} />
                    </div>
                ))}
            </div>
        </div>
    );
}
