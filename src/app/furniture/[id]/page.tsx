import { notFound } from "next/navigation";
import FurnitureDetailClient from "./FurnitureDetailClient";
import { getFurnitureById } from "@/lib/server/furniture";
import { getUserFromCookie } from "@/lib/server/auth";

export default async function FurnitureDetailPage({ params }: { params: { id: string } }) {
	const user = await getUserFromCookie();
	if (!user) return notFound();

	const { id } = await params;
	const furniture = await getFurnitureById(id, user.id);

	if (!furniture) return notFound();

	return <FurnitureDetailClient initialFurniture={furniture} />;
}
