import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const status = {
    database: 'Unknown',
    stripe: 'Unknown',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Not set',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set',
    },
  };

  try {
    // Check database connection
    await prisma.$connect();
    status.database = 'Connected';
  } catch (error) {
    console.error('Database connection error:', error);
    status.database = 'Error: ' + error.message;
  } finally {
    await prisma.$disconnect();
  }

  try {
    // Check Stripe connection
    const stripeStatus = await stripe.balance.retrieve();
    status.stripe = 'Connected';
  } catch (error) {
    console.error('Stripe connection error:', error);
    status.stripe = 'Error: ' + error.message;
  }

  res.status(200).json(status);
}