import { notFound } from "next/navigation";
import { sampleFurniture } from "@/data/sampleFurniture";
import FurnitureDetailClient from "./FurnitureDetailClient";

export default function FurnitureDetailPage({ params }: { params: { id: string } }) {
	const furniture = sampleFurniture.find((item) => item.id === params.id);

	if (!furniture) return notFound();

	return <FurnitureDetailClient initialFurniture={furniture} />;
}
