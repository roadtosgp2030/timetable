// Client-side utility for streak-related events

export const dispatchStreakUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('streakUpdated'))
  }
}