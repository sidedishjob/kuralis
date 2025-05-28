"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiInfo, FiShoppingBag, FiSettings } from "react-icons/fi";
import FurnitureDetailBasicTab from "./FurnitureDetailBasicTab";
import FurnitureDetailPurchaseTab from "./FurnitureDetailPurchaseTab";
import FurnitureDetailMaintenanceTab from "./FurnitureDetailMaintenanceTab";
import type { FurnitureWithExtras } from "@/types/furniture_new";
import type { Location } from "@/types/furniture_meta";

interface Props {
	furniture: FurnitureWithExtras;
	editedFurniture: FurnitureWithExtras;
	setEditedFurniture: (f: FurnitureWithExtras) => void;
	isEditing: boolean;
	locations: Location[];
}

export default function FurnitureDetailTabs({
	furniture,
	editedFurniture,
	setEditedFurniture,
	isEditing,
	locations,
}: Props) {
	return (
		<Tabs defaultValue="basic" className="w-full">
			<TabsList className="w-full grid grid-cols-3 mb-8 bg-transparent p-0 gap-2">
				<TabsTrigger value="basic" className="flex items-center">
					<FiInfo className="mr-2" />
					基本情報
				</TabsTrigger>
				<TabsTrigger value="purchase" className="flex items-center">
					<FiShoppingBag className="mr-2" />
					購入情報
				</TabsTrigger>
				<TabsTrigger value="maintenance" className="flex items-center">
					<FiSettings className="mr-2" />
					メンテナンス
				</TabsTrigger>
			</TabsList>

			<TabsContent value="basic">
				<FurnitureDetailBasicTab
					furniture={furniture}
					editedFurniture={editedFurniture}
					setEditedFurniture={setEditedFurniture}
					isEditing={isEditing}
					locations={locations}
				/>
			</TabsContent>

			<TabsContent value="purchase">
				<FurnitureDetailPurchaseTab
					furniture={furniture}
					editedFurniture={editedFurniture}
					setEditedFurniture={setEditedFurniture}
					isEditing={isEditing}
				/>
			</TabsContent>

			<TabsContent value="maintenance">
				<FurnitureDetailMaintenanceTab
					furniture={furniture}
					editedFurniture={editedFurniture}
					setEditedFurniture={setEditedFurniture}
					isEditing={isEditing}
				/>
			</TabsContent>
		</Tabs>
	);
}
