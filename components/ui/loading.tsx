import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 24,
  className = '',
  text = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 size={size} className='animate-spin text-blue-500' />
      {text && <p className='text-sm text-gray-600'>{text}</p>}
    </div>
  )
}

export function LoadingOverlay({
  text = 'Loading tasks...',
}: {
  text?: string
}) {
  return (
    <div className='absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10'>
      <LoadingSpinner size={32} text={text} />
    </div>
  )
}
