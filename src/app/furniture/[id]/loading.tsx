import { Skeleton } from "@/components/ui/skeleton";

export default function FurnitureDetailLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12">
      {/* 戻るボタン */}
      <Skeleton className="h-9 w-24 mb-6 rounded-md" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 画像 */}
        <Skeleton className="aspect-square w-full rounded-lg" />

        {/* 詳細 */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          {/* タブ */}
          <div className="mt-6 space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
