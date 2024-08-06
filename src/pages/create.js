import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters long" }),
  duration: z.string().regex(/^\d+$/, { message: "Duration must be a number" }),
  genre: z.string().min(1, { message: "Please select a genre" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
});

export default function CreateVideo() {
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      duration: "",
      genre: "",
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 10 }), // $10 for video creation
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setPaymentError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((err) => {
        console.error('Error fetching client secret:', err);
        setPaymentError('Failed to initialize payment. Please try again.');
      });
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    // Here you would typically send the data to your AI video generation API
    // For now, we'll just simulate a response after a short delay
    setTimeout(() => {
      setGeneratedVideo({
        url: "https://example.com/generated-video.mp4",
        thumbnail: "https://picsum.photos/300/200",
      });
    }, 2000);
  };

  const handlePayment = async () => {
    if (!stripePromise) {
      console.error('Stripe has not been initialized');
      setPaymentError('Payment system is not available. Please try again later.');
      return;
    }

    const stripe = await stripePromise;
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
    } else {
      // Payment succeeded, proceed with video creation
      setPaymentError(null);
      onSubmit(form.getValues());
    }
  };

  if (paymentError) {
    return <div className="text-red-500">{paymentError}</div>;
  }

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
          <Button type="submit">Generate Video ($10)</Button>
        </form>
      </Form>

      {generatedVideo && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent>
            <video src={generatedVideo.url} controls className="w-full" />
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
          </CardContent>
          <CardFooter>
            <Button onClick={handlePayment}>Pay and Upload Video</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}