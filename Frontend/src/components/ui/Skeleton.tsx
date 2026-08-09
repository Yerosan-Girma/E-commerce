import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  rounded?: string
  count?: number
}

function SkeletonLine({ width = 'w-full', height = 'h-4', rounded = 'rounded-lg', className = '' }: {
  width?: string
  height?: string
  rounded?: string
  className?: string
}) {
  return (
    <div
      className={[
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        width,
        height,
        rounded,
        className,
      ].join(' ')}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-darksurface rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
          <SkeletonLine height="h-5" width="w-3/4" />
          <SkeletonLine height="h-4" width="w-1/2" />
          <div className="flex justify-between items-center pt-1">
            <SkeletonLine height="h-6" width="w-1/4" />
            <SkeletonLine height="h-8" width="w-1/3" rounded="rounded-xl" />
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
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} width={width} height={height} rounded={rounded} />
      ))}
    </div>
  )
}
