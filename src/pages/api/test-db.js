import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  try {
    // Attempt to query the database
    const result = await prisma.user.findMany({
      take: 1,
    })

    res.status(200).json({ status: 'OK', message: 'Database connection successful', result })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ status: 'Error', message: 'Database connection failed', error: error.message })
  }
}