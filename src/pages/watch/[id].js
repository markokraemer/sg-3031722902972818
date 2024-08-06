import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from '@/components/VideoPlayer';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [views, setViews] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch video data
      // This is a mock implementation. Replace with actual API call.
      setVideo({
        id,
        title: "Sample TV Show",
        description: "This is a sample TV show description.",
        url: "https://example.com/sample-video.mp4",
        creator: {
          id: "creator123",
          name: "AI Creator",
        },
      });
      setComments([
        { id: 1, user: "User1", text: "Great video!" },
        { id: 2, user: "User2", text: "Interesting content!" },
      ]);
      setViews(1000);
      setUpvotes(50);
      setDownvotes(5);
    }
  }, [id]);

  const handleComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, user: session.user.name, text: newComment }]);
      setNewComment('');
    }
  };

  const handleVote = (type) => {
    if (type === 'up') {
      setUpvotes(upvotes + 1);
    } else {
      setDownvotes(downvotes + 1);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creatorId: video.creator.id }),
      });
      if (response.ok) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{video.title}</h1>
      <VideoPlayer src={video.url} />
      <div className="flex justify-between items-center">
        <p>{views} views</p>
        <div className="space-x-2">
          <Button onClick={() => handleVote('up')}>👍 {upvotes}</Button>
          <Button onClick={() => handleVote('down')}>👎 {downvotes}</Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Link href={`/profile/${video.creator.id}`}>
          <a className="text-blue-500 hover:underline">Creator: {video.creator.name}</a>
        </Link>
        <Button onClick={handleSubscribe} disabled={isSubscribed}>
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{video.description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-2">
                <p className="font-semibold">{comment.user}</p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          {session ? (
            <div className="mt-4 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <Button onClick={handleComment}>Post Comment</Button>
            </div>
          ) : (
            <p className="mt-4">Please sign in to comment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}