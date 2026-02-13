"use client";

import { useFormContext } from "react-hook-form";
import { FiInfo, FiShoppingBag, FiSettings } from "react-icons/fi";
import { FurnitureEditSchema } from "@/lib/validation/furnitureSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FurnitureDetailBasicTab from "./FurnitureDetailBasicTab";
import FurnitureDetailPurchaseTab from "./FurnitureDetailPurchaseTab";
import FurnitureDetailMaintenanceTab from "./FurnitureDetailMaintenanceTab";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { Location } from "@/types/furniture_meta";
import type { MaintenanceSummary } from "@/types/maintenance";

interface Props {
  furniture: FurnitureWithExtras;
  isEditing: boolean;
  locations: Location[];
  summary: MaintenanceSummary | null;
}

export default function FurnitureDetailTabs({
  furniture,
  isEditing,
  locations,
  summary,
}: Props) {
  const {
    formState: { errors },
  } = useFormContext<FurnitureEditSchema>();

  const hasBasicTabError = errors.name || errors.brand || errors.location_id;

  const hasPurchaseTabError = errors.purchased_at || errors.purchased_from;

  const hasMaintenanceTabError = errors.notes;

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-8 bg-transparent p-0 gap-2">
        <TabsTrigger value="basic" className="flex items-center">
          <FiInfo className="mr-2" />
          基本情報
          {hasBasicTabError && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1 rounded-sm">
              !
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="purchase" className="flex items-center">
          <FiShoppingBag className="mr-2" />
          購入情報
          {hasPurchaseTabError && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1 rounded-sm">
              !
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="maintenance" className="flex items-center">
          <FiSettings className="mr-2" />
          メンテナンス
          {hasMaintenanceTabError && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1 rounded-sm">
              !
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <FurnitureDetailBasicTab
          furniture={furniture}
          isEditing={isEditing}
          locations={locations}
        />
      </TabsContent>

      <TabsContent value="purchase">
        <FurnitureDetailPurchaseTab
          furniture={furniture}
          isEditing={isEditing}
        />
      </TabsContent>

      <TabsContent value="maintenance">
        <FurnitureDetailMaintenanceTab
          furniture={furniture}
          isEditing={isEditing}
          summary={summary}
        />
      </TabsContent>
    </Tabs>
  );
}
