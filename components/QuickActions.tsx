import Link from 'next/link'
import { Plus, Calendar, BarChart3 } from 'lucide-react'

export function QuickActions() {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Quick Actions
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Link
          href='/tasks'
          className='flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group'>
          <div className='text-center'>
            <Plus
              size={24}
              className='mx-auto text-gray-400 group-hover:text-blue-500 mb-2'
            />
            <p className='text-sm font-medium text-gray-600 group-hover:text-blue-700'>
              Create Task
            </p>
          </div>
        </Link>

        <Link
          href='/tasks'
          className='flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group'>
          <div className='text-center'>
            <Calendar
              size={24}
              className='mx-auto text-gray-400 group-hover:text-green-500 mb-2'
            />
            <p className='text-sm font-medium text-gray-600 group-hover:text-green-700'>
              View Calendar
            </p>
          </div>
        </Link>

        <div className='flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group cursor-pointer'>
          <div className='text-center'>
            <BarChart3
              size={24}
              className='mx-auto text-gray-400 group-hover:text-purple-500 mb-2'
            />
            <p className='text-sm font-medium text-gray-600 group-hover:text-purple-700'>
              View Reports
            </p>
            <p className='text-xs text-gray-400 mt-1'>Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
