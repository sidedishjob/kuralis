import { notFound } from "next/navigation";
import MaintenanceClient from "./MaintenanceClient";
import { getSampleFurniture } from "@/lib/queries/getSampleFurniture";
import { getSampleMaintenanceItems } from "@/lib/queries/getSampleMaintenanceItems";
import type { Furniture } from "@/types/furniture";

export default async function MaintenancePage({ params }: { params: { id: string } }) {
	const id = Array.isArray(params.id) ? params.id[0] : params.id;
	const furnitureList = await getSampleFurniture();
	const furniture = furnitureList.find((item) => item.id === id);

	if (!furniture || !furniture.imageUrl) {
		notFound();
	}

	const initialMaintenanceItems = await getSampleMaintenanceItems();

	return (
		<MaintenanceClient
			furniture={furniture as Furniture}
			initialMaintenanceItems={initialMaintenanceItems}
		/>
	);
}
