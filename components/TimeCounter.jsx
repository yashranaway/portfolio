import { useState, useEffect } from "react"

const TimeCounter = ({ startDate }) => {
  const [timeElapsed, setTimeElapsed] = useState("")

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date()
      const birthDate = new Date(startDate)
      
      // Normalize birth date to start of day for accurate calculation
      birthDate.setHours(0, 0, 0, 0)
      
      // Calculate whole years since birth
      let years = now.getFullYear() - birthDate.getFullYear()
      
      // Create birthday date for current year at midnight
      let lastBirthday = new Date(
        now.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
        0, 0, 0, 0
      )
      
      // If birthday hasn't occurred yet this year, subtract 1 year and use last year's birthday
      if (now < lastBirthday) {
        years--
        lastBirthday.setFullYear(now.getFullYear() - 1)
      }
      
      // Calculate the next birthday
      const nextBirthday = new Date(lastBirthday)
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
      
      // Calculate milliseconds in this age year (accounts for leap years)
      const millisecondsInYear = nextBirthday - lastBirthday
      
      // Calculate milliseconds elapsed since last birthday
      const millisecondsElapsed = now - lastBirthday
      
      // Calculate fractional progress through current age year (0 to 1)
      const yearProgress = millisecondsElapsed / millisecondsInYear
      
      // Combine whole years + fractional progress
      const preciseAge = years + yearProgress
      
      setTimeElapsed(preciseAge.toFixed(9))
    }
    updateCounter()
    const intervalId = setInterval(updateCounter, 100) // Update every 100ms for smooth animation

    return () => clearInterval(intervalId)
  }, [startDate])

  return (
    <span 
      aria-live="polite" 
      className="font-mono text-base sm:text-lg md:text-xl tabular-nums text-zinc-600 dark:text-zinc-400 transition-all duration-500 ease-out"
      style={{ willChange: 'contents' }}
    >
      {timeElapsed}
    </span>
  )
}

export default TimeCounter