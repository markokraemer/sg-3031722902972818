import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockVideos = [
  { id: 1, title: "AI-Generated Sci-Fi Adventure", creator: "AICreator1", views: 1500, thumbnail: "https://picsum.photos/300/200" },
  { id: 2, title: "Mystery Thriller AI Show", creator: "RoboWriter", views: 2200, thumbnail: "https://picsum.photos/300/200" },
  { id: 3, title: "Comedy Sketch by AI", creator: "LaughBot", views: 3000, thumbnail: "https://picsum.photos/300/200" },
  // Add more mock videos as needed
];

export default function Home() {
  const [videos, setVideos] = useState(mockVideos);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to AITube</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>{video.creator[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{video.creator}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{video.views} views</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Watch Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}