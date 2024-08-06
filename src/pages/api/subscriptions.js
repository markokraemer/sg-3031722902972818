import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscriptions = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    res.status(200).json(subscriptions.subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Error fetching subscriptions', details: error.message });
  }
}