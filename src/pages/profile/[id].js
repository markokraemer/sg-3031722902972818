import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch creator data
      // This is a mock implementation. Replace with actual API call.
      setCreator({
        id,
        name: "AI Creator",
        description: "I create amazing AI-generated content!",
        avatar: "https://picsum.photos/200",
      });
      setVideos([
        { id: 1, title: "AI-Generated Sci-Fi Adventure", views: 1500, thumbnail: "https://picsum.photos/300/200" },
        { id: 2, title: "Mystery Thriller AI Show", views: 2200, thumbnail: "https://picsum.photos/300/200" },
        { id: 3, title: "Comedy Sketch by AI", views: 3000, thumbnail: "https://picsum.photos/300/200" },
      ]);
    }
  }, [id]);

  if (!creator) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{creator.name}</CardTitle>
              <p className="text-gray-600">{creator.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button>Subscribe</Button>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-bold">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
              <p className="text-sm text-gray-500">{video.views} views</p>
            </CardContent>
            <CardContent className="pt-0">
              <Link href={`/watch/${video.id}`}>
                <Button variant="outline" className="w-full">Watch Now</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}