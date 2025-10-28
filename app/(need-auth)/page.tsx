'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import { StatsCard } from '@/components/StatsCard'
import { RecentTasks } from '@/components/RecentTasks'
import { WeeklyOverview } from '@/components/WeeklyOverview'
import { QuickActions } from '@/components/QuickActions'
import { StreakStats } from '@/components/StreakStats'
import { useStreakUpdate } from './_hooks/useStreakUpdate'
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Play,
} from 'lucide-react'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/tasks')
        if (res.ok) {
          const data = await res.json()
          setTasks(data)
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'done').length
  const inProgressTasks = tasks.filter(
    task => task.status === 'progress'
  ).length
  const pendingTasks = tasks.filter(task => task.status === 'pending').length
  const stoppedTasks = tasks.filter(task => task.status === 'stop').length
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get today's tasks
  const today = new Date()
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.start)
    return taskDate.toDateString() === today.toDateString()
  }).length

  // Get this week's tasks
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.start)
    return taskDate >= startOfWeek && taskDate <= endOfWeek
  }).length

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-64 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-32 bg-gray-200 rounded-lg'></div>
            ))}
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='h-64 bg-gray-200 rounded-lg'></div>
            <div className='h-64 bg-gray-200 rounded-lg'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>
          Welcome back! Here's an overview of your tasks and productivity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatsCard
          title='Total Tasks'
          value={totalTasks}
          icon={<Calendar size={24} />}
          description='All tasks created'
          color='blue'
        />
        <StatsCard
          title='Completed'
          value={completedTasks}
          icon={<CheckCircle size={24} />}
          description={`${completionRate}% completion rate`}
          trend={{ value: completionRate, isPositive: completionRate > 50 }}
          color='green'
        />
        <StatsCard
          title='In Progress'
          value={inProgressTasks}
          icon={<Play size={24} />}
          description='Currently working on'
          color='purple'
        />
        <StatsCard
          title="Today's Tasks"
          value={todayTasks}
          icon={<Clock size={24} />}
          description='Tasks scheduled for today'
          color='orange'
        />
      </div>

      {/* Additional Stats Row */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <StatsCard
          title='Pending Tasks'
          value={pendingTasks}
          icon={<AlertCircle size={24} />}
          description='Tasks waiting to start'
          color='orange'
        />
        <StatsCard
          title='This Week'
          value={weekTasks}
          icon={<TrendingUp size={24} />}
          description='Tasks this week'
          color='blue'
        />
        <StatsCard
          title='Stopped Tasks'
          value={stoppedTasks}
          icon={<AlertCircle size={24} />}
          description='Tasks that were stopped'
          color='red'
        />
        <StreakStats />
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <RecentTasks tasks={tasks} />
        </div>
        <div className='space-y-6'>
          <QuickActions />
          <WeeklyOverview tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
