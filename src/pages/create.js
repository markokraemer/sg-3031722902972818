import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from '@/components/VideoPlayer';

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters long" }),
  duration: z.string().regex(/^\d+$/, { message: "Duration must be a number" }),
  genre: z.string().min(1, { message: "Please select a genre" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  thumbnail: z.instanceof(FileList).refine((files) => files.length > 0, "Thumbnail is required"),
});

export default function CreateVideo() {
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      duration: "",
      genre: "",
      title: "",
      description: "",
      thumbnail: undefined,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    // Here you would typically send the data to your AI video generation API
    // For now, we'll just simulate a response after a short delay
    setTimeout(() => {
      setGeneratedVideo({
        url: "https://example.com/generated-video.mp4",
        thumbnail: URL.createObjectURL(data.thumbnail[0]),
      });
    }, 2000);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Create AI-Generated TV Show</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your TV show idea..." {...field} />
                </FormControl>
                <FormDescription>
                  Be as detailed as possible to get the best results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (in seconds)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="scifi">Science Fiction</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Generate Video</Button>
        </form>
      </Form>

      {generatedVideo && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoPlayer src={generatedVideo.url} />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter video description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleThumbnailChange(e);
                      }}
                      {...rest}
                    />
                  </FormControl>
                  {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-2 max-w-full h-auto" />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button>Upload Video</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}