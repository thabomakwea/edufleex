import { prisma } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export default async function MyListPage() {
    const favorites = await prisma.userFavorite.findMany({
        where: { userId: 'default-user' },
        include: {
            video: {
                include: { category: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">My List</h1>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-xl text-gray-500">You haven't added any videos to your list yet.</p>
                    <p className="mt-2 text-gray-400 font-light">Explore educational content and click the plus icon to save them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="space-y-2">
                            <VideoCard video={fav.video} />
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{fav.video.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
