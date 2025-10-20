import { useEffect } from 'react'

interface PropsType {
  setIsHelpModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function useShortcuts({ setIsHelpModalOpen }: PropsType) {
  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Show help modal on Ctrl+/ or Cmd+/
      if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setIsHelpModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])
}
