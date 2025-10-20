import { Modal } from './ui/modal'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Calendar Navigation</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Create new event</span>
              <span className="text-gray-500">Click and drag on calendar</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Edit event</span>
              <span className="text-gray-500">Click on event</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Move event</span>
              <span className="text-gray-500">Drag event to new time</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Resize event</span>
              <span className="text-gray-500">Drag event edges</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Modal Actions</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Submit form</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Enter</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Submit form (alternative)</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Close modal</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Esc</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span>Delete event</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Delete</kbd>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Text Input</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>New line in description</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Shift + Enter</kbd>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Help</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Show this help</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Ctrl + /</kbd>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}