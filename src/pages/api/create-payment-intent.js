import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects the amount in cents
        currency: 'usd',
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Error creating payment intent:', err);
      res.status(500).json({ error: 'Error creating payment intent' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}