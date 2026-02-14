"use client";

import Link from "next/link";
import { FiTool, FiList, FiCalendar } from "react-icons/fi";
import { useFormContext } from "react-hook-form";
import type { FurnitureWithExtras } from "@/types/furniture";
import { MaintenanceSummary } from "@/types/maintenance";
import type { FurnitureEditSchema } from "@/lib/validation/furnitureSchema";

interface Props {
  furniture: FurnitureWithExtras;
  isEditing: boolean;
  summary: MaintenanceSummary | null;
}

export default function FurnitureDetailMaintenanceTab({
  furniture,
  isEditing,
  summary,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FurnitureEditSchema>();

  const formattedNextDue =
    summary?.nearestDueDate && summary?.nearestTaskName
      ? `${summary.nearestDueDate}（${summary.nearestTaskName}）`
      : "未設定";
  const formattedTaskCount =
    summary?.activeTaskCount !== undefined
      ? `${summary.activeTaskCount} 件`
      : "未設定";

  const isOverdue =
    summary?.nearestDueDate &&
    new Date(summary.nearestDueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* メンテナンス概要 */}
      <div className="bg-white p-6 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
        <h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
          メンテナンス概要
        </h2>
        <div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
          <div className="w-28 md:w-36 shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
            <FiCalendar className="mr-2" size={14} />
            次回予定
          </div>
          <div
            className={`flex-1 min-w-0 font-normal tracking-tighter-custom truncate ${
              isOverdue ? "text-red-500" : ""
            }`}
          >
            {formattedNextDue}
          </div>
        </div>
        <div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
          <div className="w-28 md:w-36 shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
            <FiTool className="mr-2" size={14} />
            メンテ対象
          </div>
          <div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
            {formattedTaskCount}
          </div>
        </div>

        <Link
          href={`/furniture/${furniture.id}/maintenance`}
          className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
        >
          <FiList size={14} className="mr-2" />
          <span>メンテナンスを管理</span>
        </Link>
        {isOverdue && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-sm font-bold tracking-tighter-custom">
            次回予定日が過去になっています。早急にメンテナンスを実施してください。
          </div>
        )}
      </div>

      {/* 備考欄 */}
      {(isEditing || furniture.notes) && (
        <div className="bg-white p-6 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
          <h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-2">
            備考
          </h2>
          {isEditing ? (
            <textarea
              {...register("notes")}
              className="w-full p-4 font-normal tracking-tighter-custom bg-kuralis-50 rounded-sm border-none focus:ring-1 focus:ring-kuralis-900 outline-none resize-none"
              rows={3}
            />
          ) : (
            <p className="p-4 bg-kuralis-50 rounded-sm font-normal tracking-tighter-custom wrap-break-word">
              {furniture.notes}
            </p>
          )}
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
