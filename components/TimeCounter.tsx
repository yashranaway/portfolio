import { useState, useEffect } from "react"

interface TimeCounterProps {
  startDate: Date | string | number
}

const TimeCounter = ({ startDate }: TimeCounterProps) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("")

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
      const millisecondsInYear = nextBirthday.getTime() - lastBirthday.getTime()

      // Calculate milliseconds elapsed since last birthday
      const millisecondsElapsed = now.getTime() - lastBirthday.getTime()

      // Calculate fractional progress through current age year (0 to 1)
      const yearProgress = millisecondsElapsed / millisecondsInYear

      // Combine whole years + fractional progress
      const preciseAge = years + yearProgress

      setTimeElapsed(preciseAge.toFixed(9))
    }
    updateCounter()
    const intervalId = setInterval(updateCounter, 100)

    return () => clearInterval(intervalId)
  }, [startDate])

  if (!timeElapsed) {
    return (
      <span
        aria-live="polite"
        className="font-mono text-base sm:text-lg md:text-xl tabular-nums text-zinc-600 dark:text-zinc-400"
      />
    )
  }

  return (
    <span
      aria-live="polite"
      aria-label={timeElapsed}
      className="t-digit-group is-animating font-mono text-base sm:text-lg md:text-xl tabular-nums text-zinc-600 dark:text-zinc-400"
    >
      {timeElapsed.split("").map((ch, i) => (
        <span
          key={i}
          className="t-digit"
          style={{ animationDelay: `calc(var(--digit-stagger) * ${i})` }}
          aria-hidden="true"
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export default TimeCounter
