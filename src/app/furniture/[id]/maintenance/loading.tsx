import { Skeleton } from "@/components/ui/skeleton";

export default function MaintenanceLoading() {
  return (
    <div className="container mx-auto py-6 md:py-12 px-6 md:px-12">
      {/* 戻るリンク */}
      <Skeleton className="h-5 w-36 mb-8 rounded-sm" />

      <div className="max-w-3xl mx-auto">
        {/* ヘッダー（タイトル + 追加ボタン） */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-64 rounded-sm" />
          <Skeleton className="hidden md:block size-10 rounded-full" />
        </div>

        {/* タスクカードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col p-6 border border-kuralis-200 rounded-sm"
            >
              {/* タスクヘッダー（アイコン + タスク名 + 次回予定） */}
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="size-5 rounded-sm" />
                <div className="grow space-y-2">
                  <Skeleton className="h-5 w-32 rounded-sm" />
                  <Skeleton className="h-4 w-24 rounded-sm" />
                </div>
                <Skeleton className="h-12 w-20 rounded-sm" />
              </div>
              {/* 履歴エリア */}
              <div className="mb-2 md:ml-8 space-y-2">
                <Skeleton className="h-4 w-32 rounded-sm" />
                <Skeleton className="h-4 w-44 rounded-sm" />
              </div>
              {/* タスク状態バー */}
              <div className="mt-auto">
                <Skeleton className="h-10 w-full rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
