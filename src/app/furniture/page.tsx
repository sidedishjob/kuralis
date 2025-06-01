import { getFurniture } from "@/lib/server/furniture";
import FurnitureListClient from "./FurnitureListClient";
import { getUserFromCookie } from "@/lib/supabase/server";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";
import { redirect } from "next/navigation";

export default async function FurnitureListPage() {
	const user = await getUserFromCookie();
	if (!user) return redirect("/auth/login");

	const [furniture, meta] = await Promise.all([
		user ? getFurniture(user.id) : Promise.resolve([]),
		getFurnitureMeta(),
	]);

	return (
		<FurnitureListClient
			user={user}
			initialFurniture={furniture}
			initialCategories={meta.categories}
			initialLocations={meta.locations}
		/>
	);
}
