import { Skeleton } from "@/components/ui/skeleton";

export default function FurnitureListLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* 検索バー */}
      <Skeleton className="h-10 w-full mb-6 rounded-md" />

      {/* カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
