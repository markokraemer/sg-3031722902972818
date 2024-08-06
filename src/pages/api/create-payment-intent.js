import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Creating payment intent...');
      const { amount } = req.body;

      if (!amount || isNaN(amount)) {
        console.error('Invalid amount:', amount);
        return res.status(400).json({ error: 'Invalid amount' });
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not set');
        return res.status(500).json({ error: 'Stripe secret key is not configured' });
      }

      console.log('Stripe secret key:', process.env.STRIPE_SECRET_KEY.substring(0, 8) + '...');

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects the amount in cents
        currency: 'usd',
      });

      console.log('Payment intent created successfully:', paymentIntent.id);
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Error creating payment intent:', err);
      if (err.type === 'StripeAuthenticationError') {
        res.status(401).json({ error: 'Authentication with Stripe failed. Please check your Stripe secret key.' });
      } else if (err.type === 'StripeConnectionError') {
        res.status(503).json({ error: 'Unable to connect to Stripe. Please try again later.' });
      } else {
        res.status(500).json({ error: 'Error creating payment intent', details: err.message, type: err.type });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}