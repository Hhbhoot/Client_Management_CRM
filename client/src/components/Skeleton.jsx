function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-800 rounded-2xl ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-8">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="bg-gray-900/50 p-6 rounded-[32px] border border-gray-800 space-y-6">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  )
}

export default Skeleton
