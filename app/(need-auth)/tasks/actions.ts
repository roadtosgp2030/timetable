'use server'

import { prisma } from '@/lib/prisma'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import { cookies } from 'next/headers'

export async function createTask(data: Task) {
  const cookie = await cookies()
  const userEncoded = cookie.get('user')?.value
  const userId: User = JSON.parse(decodeURIComponent(userEncoded!))

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        start: new Date(data.start),
        end: data.end ? new Date(data.end) : null,
        status: data.status,
        userId: userId.id,
      },
    })
    return task
  } catch (error) {
    console.error('Failed to create task:', error)
    throw error
  }
}

export async function updateTask(taskId: string, data: Task) {
  const cookie = await cookies()
  const userEncoded = cookie.get('user')?.value
  const userId: User = JSON.parse(decodeURIComponent(userEncoded!))

  await prisma.task.update({
    where: {
      id: taskId,
      userId: userId.id,
    },
    data: {
      title: data.title,
      description: data.description,
      start: new Date(data.start),
      end: data.end ? new Date(data.end) : null,
      status: data.status,
    },
  })
}

export async function deleteTask(taskId: string) {
  const cookie = await cookies()
  const userEncoded = cookie.get('user')?.value
  const userId: User = JSON.parse(decodeURIComponent(userEncoded!))

  await prisma.task.delete({
    where: {
      id: taskId,
      userId: userId.id,
    },
  })
}
