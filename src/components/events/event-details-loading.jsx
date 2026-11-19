import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailsLoading() {
  return (
    <div role="status" aria-label="Loading event details">
      <Skeleton className="h-[440px] w-full rounded-[22px] max-md:h-[300px]" />
      <Skeleton className="mt-5 h-28 w-full rounded-[20px]" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6"><Skeleton className="h-10 w-4/5" /><Skeleton className="h-32 w-full" /><Skeleton className="h-40 w-full rounded-2xl" /></div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
