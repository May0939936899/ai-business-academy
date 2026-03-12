import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover, glow, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass rounded-2xl transition-all duration-300',
          hover !== false && 'glass-hover hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
          glow && 'shadow-lg shadow-blue-500/10',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
