import { Skeleton } from "@/components/ui/skeleton";

export default function MaintenanceLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 hidden md:block" />
        </div>
      </div>

      {/* タブ */}
      <Skeleton className="h-10 w-48 mb-6 rounded-md" />

      {/* カレンダー / ボードエリア */}
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}
