import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'

export interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading = false, className, ...props }, ref) => {
    const [width, setWidth] = useState('auto')
    const buttonRef = useRef(null)

    useEffect(() => {
      if (buttonRef.current) {
        const button = buttonRef.current
        setWidth(`${button.offsetWidth}px`)
      }
    }, [children])

    return (
      <Button
        ref={(node) => {
          buttonRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn(
          'relative transition-all duration-300 ease-out',
          isLoading && 'pl-8',
          className
        )}
        style={{
          width: isLoading ? `calc(${width} + 16px)` : width,
        }}
        disabled={isLoading}
        {...props}
      >
        <div
          className={cn(
            'absolute left-2 transition-opacity duration-200',
            isLoading ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
        {children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
