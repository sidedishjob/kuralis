import { notFound } from "next/navigation";
import { sampleFurniture } from "@/data/sampleFurniture";
import FurnitureDetailClient from "./FurnitureDetailClient";

export default async function FurnitureDetailPage({ params }: { params: { id: string } }) {
	// const furniture = sampleFurniture.find((item) => item.id === params.id);
	const { id } = await params;
	const furniture = sampleFurniture.find((item) => item.id === id);

	if (!furniture) return notFound();

	return <FurnitureDetailClient initialFurniture={furniture} />;
}
