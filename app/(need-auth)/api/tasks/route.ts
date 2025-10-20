import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const userId = userCookie
    ? JSON.parse(decodeURIComponent(userCookie.value)).id
    : null

  const tasks = await prisma.task.findMany({
    where: { userId, isDeleted: false },
  })

  return new Response(JSON.stringify(tasks), {
    headers: { 'Content-Type': 'application/json' },
  })
}
