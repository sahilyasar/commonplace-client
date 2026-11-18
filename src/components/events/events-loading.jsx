import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="mt-7 border-t border-border pt-7" role="status" aria-label="Loading events">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-9 w-24 rounded-full" />)}
      </div>
      <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="overflow-hidden rounded-[20px] bg-card">
            <Skeleton className="aspect-[1.95] w-full" />
            <div className="space-y-5 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
