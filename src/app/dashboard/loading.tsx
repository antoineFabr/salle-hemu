import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDashboard() {
  return (
    <div className="flex min-h-screen w-full bg-background">

      <aside className="hidden w-64 flex-col border-r bg-sidebar p-4 md:flex">
        <Skeleton className="mb-6 h-8 w-3/4 rounded-md" />

        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </aside>

      <main className="flex flex-1 flex-col">

        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <Skeleton className="h-6 w-6 rounded-md" /> {/* Sidebar Trigger */}
          <Skeleton className="ml-2 h-4 w-4 shrink-0 rounded-full" /> {/* Separator */}
          <Skeleton className="ml-2 h-4 w-32 rounded-md" /> {/* Breadcrumb */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4">
                <Skeleton className="h-10 w-32 shrink-0 rounded-md" />
                <div className="flex flex-1 gap-2">
                  <Skeleton className="h-10 w-1/4 rounded-md" />
                  <Skeleton className="h-10 w-1/2 rounded-md" />
                  <Skeleton className="h-10 w-1/4 rounded-md opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
