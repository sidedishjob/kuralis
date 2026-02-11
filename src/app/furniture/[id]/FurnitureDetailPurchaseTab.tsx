"use client";

import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useFormContext } from "react-hook-form";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { FurnitureEditSchema } from "@/lib/validation";
import { format } from "date-fns";

interface Props {
  furniture: FurnitureWithExtras;
  isEditing: boolean;
}

export default function FurnitureDetailPurchaseTab({
  furniture,
  isEditing,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FurnitureEditSchema>();

  return (
    <div className="bg-white p-6 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
      <h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
        購入情報
      </h2>

      {(isEditing || furniture.purchased_at) && (
        <div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
          <div className="w-28 md:w-36 shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
            <FiCalendar size={16} className="mr-2" />
            <span>購入日</span>
          </div>
          {isEditing ? (
            <input
              type="date"
              {...register("purchased_at")}
              className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
            />
          ) : (
            <div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
              {furniture.purchased_at &&
                format(new Date(furniture.purchased_at), "yyyy/MM/dd")}
            </div>
          )}
          {errors.purchased_at && (
            <p className="text-red-500 text-sm mt-1">
              {errors.purchased_at.message}
            </p>
          )}
        </div>
      )}

      {(isEditing || furniture.purchased_from) && (
        <div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
          <div className="w-28 md:w-36 shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
            <FiMapPin size={16} className="mr-2" />
            <span>購入店舗</span>
          </div>
          {isEditing ? (
            <div>
              <input
                type="text"
                placeholder="購入店舗"
                {...register("purchased_from")}
                className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
              />
              {errors.purchased_from && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.purchased_from.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate w-full">
              {furniture.purchased_from}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
