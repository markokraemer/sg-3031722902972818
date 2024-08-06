import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionsTab() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchSubscriptions();
    }
  }, [session]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      const data = await response.json();
      setSubscriptions(data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>You haven't subscribed to any channels yet.</p>
      ) : (
        subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader>
              <CardTitle>{subscription.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{subscription.description}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}