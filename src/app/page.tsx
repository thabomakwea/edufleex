import { prisma } from '@/lib/db';
import HeroBanner from '@/components/HeroBanner';
import VideoRow from '@/components/VideoRow';

export default async function Home() {
  // Fetch all videos for rows
  const allVideos = await prisma.video.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  // Check if there are any videos at all
  if (allVideos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium text-gray-500">No videos found. Please seed the database.</p>
      </div>
    );
  }

  // Try to find featured videos first
  const featuredVideos = allVideos.filter(v => v.isFeatured);

  // Prioritize "Algebra Basics" if it's among the featured ones, otherwise take the first featured video
  // If no featured videos, just use the most recent video
  let featuredVideo = featuredVideos.find(v => v.title.includes('Algebra')) || featuredVideos[0] || allVideos[0];

  // Group videos by category
  const categories = await prisma.category.findMany({
    include: {
      videos: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Related episodes for the featured video (just videos from the same subject for now)
  const episodes = allVideos.filter(v =>
    v.subject === featuredVideo.subject && v.id !== featuredVideo.id
  );

  return (
    <div className="relative pb-24">
      <HeroBanner featuredVideo={featuredVideo} episodes={episodes} />

      <div className="relative z-20 mt-[-100px] space-y-8">
        {categories.map((category) => (
          category.videos.length > 0 && (
            <VideoRow
              key={category.id}
              title={category.name}
              videos={category.videos}
            />
          )
        ))}
      </div>
    </div>
  );
}
