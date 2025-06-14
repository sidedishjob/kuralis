"use client";

import { useFormContext } from "react-hook-form";
import { FiInfo, FiShoppingBag, FiSettings } from "react-icons/fi";
import { FurnitureEditSchema } from "@/lib/validation";
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

export default function FurnitureDetailTabs({ furniture, isEditing, locations, summary }: Props) {
	const {
		formState: { errors },
	} = useFormContext<FurnitureEditSchema>();

	const hasBasicTabError = errors.name || errors.brand || errors.location_id;
	const hasPurchaseTabError = errors.purchased_at || errors.purchased_from;
	const hasMaintenanceTabError = errors.notes;

	return (
		<Tabs defaultValue="basic" className="w-full">
			<TabsList className="w-full grid grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm">
				<TabsTrigger
					value="basic"
					className="flex items-center justify-center py-3 px-4 rounded-lg data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all duration-300"
				>
					<FiInfo className="mr-2" size={18} />
					<span className="text-sm font-medium">基本情報</span>
					{hasBasicTabError && (
						<span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
							!
						</span>
					)}
				</TabsTrigger>
				<TabsTrigger
					value="purchase"
					className="flex items-center justify-center py-3 px-4 rounded-lg data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all duration-300"
				>
					<FiShoppingBag className="mr-2" size={18} />
					<span className="text-sm font-medium">購入情報</span>
					{hasPurchaseTabError && (
						<span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
							!
						</span>
					)}
				</TabsTrigger>
				<TabsTrigger
					value="maintenance"
					className="flex items-center justify-center py-3 px-4 rounded-lg data-[state=active]:bg-neutral-900 data-[state=active]:text-white transition-all duration-300"
				>
					<FiSettings className="mr-2" size={18} />
					<span className="text-sm font-medium">メンテナンス</span>
					{hasMaintenanceTabError && (
						<span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
							!
						</span>
					)}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="basic" className="mt-0">
				<FurnitureDetailBasicTab
					furniture={furniture}
					isEditing={isEditing}
					locations={locations}
				/>
			</TabsContent>

			<TabsContent value="purchase" className="mt-0">
				<FurnitureDetailPurchaseTab furniture={furniture} isEditing={isEditing} />
			</TabsContent>

			<TabsContent value="maintenance" className="mt-0">
				<FurnitureDetailMaintenanceTab
					furniture={furniture}
					isEditing={isEditing}
					summary={summary}
				/>
			</TabsContent>
		</Tabs>
	);
}
