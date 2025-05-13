import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={`card ${className || ''}`} {...props} />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={`card-header ${className || ''}`} {...props} />
  )
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3 className={`card-title ${className || ''}`} {...props} />
  )
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p className={`card-description ${className || ''}`} {...props} />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={`card-content ${className || ''}`} {...props} />
  )
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={`card-footer ${className || ''}`} {...props} />
  )
}
