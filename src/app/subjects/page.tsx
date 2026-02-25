import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Subjects - Edufleex',
  description: 'Discover amazing educational content across various subjects. Learn at your own pace with engaging video lessons.',
};

export default async function SubjectsPage() {
  // Fetch all videos to get unique subjects
  const videos = await prisma.video.findMany({
    select: {
      subject: true,
      thumbnail: true,
    },
  });

  // Get unique subjects with their thumbnails
  const subjectMap = new Map();
  videos.forEach((video) => {
    if (!subjectMap.has(video.subject)) {
      subjectMap.set(video.subject, video.thumbnail);
    }
  });

  const subjects = Array.from(subjectMap.entries()).map(([name, thumbnail]) => ({
    name,
    thumbnail,
  }));

  // Subject color scheme for gradients
  const subjectColors = [
    'from-blue-600 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-500',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-24 pb-12 px-4 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="mb-4 text-5xl md:text-6xl font-bold text-white">
            Explore <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Subjects</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover amazing educational content across various subjects. Learn at your own pace with engaging video lessons.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{subjects.length}</h3>
            <p className="text-gray-300 text-sm">Subjects Available</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{videos.length}</h3>
            <p className="text-gray-300 text-sm">Video Lessons</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">HD</h3>
            <p className="text-gray-300 text-sm">Quality Content</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <Link
              key={subject.name}
              href={`/subjects/${encodeURIComponent(subject.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={subject.thumbnail}
                  alt={subject.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${subjectColors[index % subjectColors.length]} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore lessons and tutorials
                  </p>
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-1 w-12 bg-white rounded-full" />
                    <span className="text-xs text-white font-medium">View All</span>
                  </div>
                </div>
              </div>

              {/* Corner Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-gray-900">NEW</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Subjects Available</h3>
            <p className="text-gray-500">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
