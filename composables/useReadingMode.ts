/**
 * Reading Mode Composable
 * Provides reading mode state management with localStorage persistence
 */

export const useReadingMode = () => {
  const isReadingMode = useState<boolean>('reading-mode', () => false)

  // Initialize from localStorage on client side
  if (process.client) {
    const stored = localStorage.getItem('reading-mode')
    if (stored !== null) {
      isReadingMode.value = stored === 'true'
    }
  }

  const toggleReadingMode = () => {
    isReadingMode.value = !isReadingMode.value
    if (process.client) {
      localStorage.setItem('reading-mode', String(isReadingMode.value))
    }
  }

  const enableReadingMode = () => {
    isReadingMode.value = true
    if (process.client) {
      localStorage.setItem('reading-mode', 'true')
    }
  }

  const disableReadingMode = () => {
    isReadingMode.value = false
    if (process.client) {
      localStorage.setItem('reading-mode', 'false')
    }
  }

  // Keyboard shortcut support (F or R key)
  if (process.client) {
    useEventListener('keydown', (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Toggle on 'f' or 'r' key
      if (event.key.toLowerCase() === 'f' || event.key.toLowerCase() === 'r') {
        event.preventDefault()
        toggleReadingMode()
      }
    })
  }

  return {
    isReadingMode: readonly(isReadingMode),
    toggleReadingMode,
    enableReadingMode,
    disableReadingMode,
  }
}
