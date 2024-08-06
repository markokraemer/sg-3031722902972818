import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

const mockVideos = [
  { id: 1, title: "AI-Generated Sci-Fi Adventure", creator: "AICreator1", views: 1500, thumbnail: "https://picsum.photos/300/200" },
  { id: 2, title: "Mystery Thriller AI Show", creator: "RoboWriter", views: 2200, thumbnail: "https://picsum.photos/300/200" },
  { id: 3, title: "Comedy Sketch by AI", creator: "LaughBot", views: 3000, thumbnail: "https://picsum.photos/300/200" },
];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching videos...');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVideos(mockVideos);
        console.log('Videos fetched successfully:', mockVideos);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    console.log('Filtering videos with query:', searchQuery);
    const filteredVideos = mockVideos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setVideos(filteredVideos);
    console.log('Filtered videos:', filteredVideos);
  }, [searchQuery]);

  if (error) {
    console.error('Rendering error state:', error);
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  console.log('Rendering Home component');
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to AITube</h1>
      <div className="max-w-xl mx-auto">
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback>{video.creator[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{video.creator}</span>
                  </div>
                  <p className="text-sm text-gray-500">{video.views} views</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/watch/${video.id}`}>
                  <Button variant="outline">Watch Now</Button>
                </Link>
                <Button variant="ghost" size="sm">Subscribe</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}