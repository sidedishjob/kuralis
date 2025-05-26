"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiInfo, FiShoppingBag, FiSettings } from "react-icons/fi";
import FurnitureDetailBasicTab from "./FurnitureDetailBasicTab";
import FurnitureDetailPurchaseTab from "./FurnitureDetailPurchaseTab";
import FurnitureDetailMaintenanceTab from "./FurnitureDetailMaintenanceTab";

import { FurnitureWithExtras } from "@/types/furniture_new";

interface Props {
	furniture: FurnitureWithExtras;
	editedFurniture: FurnitureWithExtras;
	setEditedFurniture: (f: FurnitureWithExtras) => void;
	isEditing: boolean;
}

const TABS = [
	{
		value: "basic",
		title: "基本情報",
		icon: FiInfo,
		Component: FurnitureDetailBasicTab,
	},
	{
		value: "purchase",
		title: "購入情報",
		icon: FiShoppingBag,
		Component: FurnitureDetailPurchaseTab,
	},
	{
		value: "maintenance",
		title: "メンテナンス",
		icon: FiSettings,
		Component: FurnitureDetailMaintenanceTab,
	},
];

export default function FurnitureDetailTabs({
	furniture,
	editedFurniture,
	setEditedFurniture,
	isEditing,
}: Props) {
	return (
		<Tabs defaultValue="basic" className="w-full">
			<TabsList className="w-full grid grid-cols-3 mb-8 bg-transparent p-0 gap-2">
				{TABS.map(({ value, title, icon: Icon }) => (
					<TabsTrigger key={value} value={value} className="flex items-center">
						<Icon className="mr-2" /> {title}
					</TabsTrigger>
				))}
			</TabsList>

			{TABS.map(({ value, Component }) => (
				<TabsContent key={value} value={value}>
					<Component
						furniture={furniture}
						editedFurniture={editedFurniture}
						setEditedFurniture={setEditedFurniture}
						isEditing={isEditing}
					/>
				</TabsContent>
			))}
		</Tabs>
	);
}
