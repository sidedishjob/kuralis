import { getFurniture } from "@/lib/server/furniture";
import FurnitureListClient from "./FurnitureListClient";
import { getUserFromCookie } from "@/lib/server/auth";
import { getFurnitureMeta } from "@/lib/server/furnitureMeta";

export default async function FurnitureListPage() {
	const user = await getUserFromCookie();
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
