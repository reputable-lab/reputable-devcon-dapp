import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

export function ProgressBar({ percent, className }: { percent: number; className?: string }) {
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setBarWidth(percent)
    }, 200)
  }, [])

  useEffect(() => {
    setBarWidth(percent)
  }, [percent])

  return (
    <div className="relative h-2.5">
      <div
        className={clsx(
          'absolute left-0 h-2.5 w-full flex-1 rounded-[30px] bg-gray-100',
          className
        )}
      />
      <div
        className={clsx(
          'absolute -left-[0.5px] z-10 h-2.5 w-full flex-1 rounded-[30px] bg-primary transition-[width] duration-300 ease-out',
          barWidth === 0 ? 'min-w-0' : 'min-w-[10px]',
          className
        )}
        style={{
          width: barWidth === 0 ? '0' : `calc(${barWidth}% + 1px)`,
        }}
      />
    </div>
  )
}
