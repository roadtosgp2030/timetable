'use server'

import { prisma } from '@/lib/prisma'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import { cookies } from 'next/headers'
import { updateUserStreak } from '@/actions/streak'
import { revalidatePath } from 'next/cache'

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

    // Update user streak when creating a task
    await updateUserStreak(userId.id)

    return task
  } catch (error) {
    console.error('Failed to create task:', error)
    throw error
  }
}

export async function updateTask(data: Task) {
  const cookie = await cookies()
  const userEncoded = cookie.get('user')?.value
  const userId: User = JSON.parse(decodeURIComponent(userEncoded!))

  try {
    const task = await prisma.task.update({
      where: {
        id: data.id,
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

    // Update user streak when updating a task
    await updateUserStreak(userId.id)

    return task
  } catch (error) {
    console.error('Failed to update task:', error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  const cookie = await cookies()
  const userEncoded = cookie.get('user')?.value
  const userId: User = JSON.parse(decodeURIComponent(userEncoded!))

  try {
    // Validate the taskId format before using it
    if (!taskId || taskId.length !== 24) {
      throw new Error('Invalid task ID format')
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId.id,
      },
      data: {
        isDeleted: true,
      },
    })

    revalidatePath('/tasks')

    return task
  } catch (error) {
    console.error('Failed to delete task:', error)
    throw error
  }
}
