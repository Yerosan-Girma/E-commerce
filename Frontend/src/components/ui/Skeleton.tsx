import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  rounded?: string
  count?: number
}

function SkeletonLine({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  className = '',
}: {
  width?: string
  height?: string
  rounded?: string
  className?: string
}) {
  return (
    <div
      className={[
        'animate-pulse bg-white/6 dark:bg-white/6',
        width, height, rounded, className,
      ].join(' ')}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="animate-pulse">
        <div className="h-52 bg-white/6 rounded-t-2xl" />
        <div className="p-5 space-y-3">
          <SkeletonLine height="h-5" width="w-3/4" />
          <SkeletonLine height="h-3.5" width="w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <SkeletonLine height="h-7" width="w-1/4" />
            <SkeletonLine height="h-9" width="w-1/3" rounded="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-lg',
  count = 1,
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div className={`space-y-2.5 ${className}`} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} width={width} height={height} rounded={rounded} />
      ))}
    </div>
  )
}
