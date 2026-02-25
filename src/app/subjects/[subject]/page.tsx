import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import VideoRow from '@/components/VideoRow';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

interface SubjectPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { subject } = await params;
  const decodedSubject = decodeURIComponent(subject);
  
  return {
    title: `${decodedSubject} - Edufleex`,
    description: `Explore high-quality video lessons for ${decodedSubject}. Learn at your own pace with expert instructors.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;
  const decodedSubject = decodeURIComponent(subject);

  // Fetch all videos for this subject
  const videos = await prisma.video.findMany({
    where: {
      subject: decodedSubject,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (videos.length === 0) {
    notFound();
  }

  // Group videos by grade
  const videosByGrade = videos.reduce((acc, video) => {
    if (!acc[video.grade]) {
      acc[video.grade] = [];
    }
    acc[video.grade].push(video);
    return acc;
  }, {} as Record<string, typeof videos>);

  const grades = Object.keys(videosByGrade).sort();

  // Featured video (first video)
  const featuredVideo = videos[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Section with Featured Video */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${featuredVideo.thumbnail.replace('/0.jpg', '/maxresdefault.jpg')})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-4 md:px-12 pb-20">
          <Link
            href="/subjects"
            className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Subjects</span>
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 w-fit">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 font-semibold uppercase text-sm tracking-wide">
              {decodedSubject}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl drop-shadow-2xl">
            Master {decodedSubject}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8 drop-shadow-lg">
            Explore {videos.length} high-quality video lessons designed to help you excel in {decodedSubject}.
            Learn at your own pace with expert instructors.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/video/${featuredVideo.videoId}`}
              className="flex items-center gap-3 rounded-lg bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-gray-200"
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Learning
            </Link>
            <div className="flex items-center gap-3 text-white">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold">{videos.length}</span>
              </div>
              <span className="text-sm text-gray-300">Videos Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Sections by Grade */}
      <div className="relative z-20 mt-[-100px] space-y-8 pb-24">
        {grades.map((grade) => (
          <VideoRow
            key={grade}
            title={`${decodedSubject} - ${grade}`}
            videos={videosByGrade[grade]}
          />
        ))}

        {/* All Videos Section */}
        <VideoRow title={`All ${decodedSubject} Videos`} videos={videos} />
      </div>
    </div>
  );
}
