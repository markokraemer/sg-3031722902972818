import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { creatorId } = req.body;
  const userId = session.user.id;

  try {
    const subscription = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptions: {
          connect: { id: creatorId },
        },
      },
    });

    res.status(200).json({ message: 'Subscribed successfully', subscription });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'Error subscribing', error: error.message });
  }
}