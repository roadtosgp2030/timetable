import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit?: () => void
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close modal on Escape key
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      // Submit form on Ctrl+Enter or Cmd+Enter
      if (
        event.key === 'Enter' &&
        (event.ctrlKey || event.metaKey) &&
        onSubmit
      ) {
        event.preventDefault()
        onSubmit()
        return
      }

      // Submit form on Enter if not in textarea and not holding shift
      if (event.key === 'Enter' && !event.shiftKey && onSubmit) {
        const target = event.target as HTMLElement
        // Don't submit if we're in a textarea (allow normal Enter behavior)
        if (target.tagName.toLowerCase() === 'textarea') {
          return
        }
        event.preventDefault()
        onSubmit()
      }
    }

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, onSubmit])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 bg-opacity-50'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-xl'>
            ×
          </button>
        </div>

        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}
