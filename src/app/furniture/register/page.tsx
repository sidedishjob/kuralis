import { redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/supabase/server";
import RegisterFurnitureClient from "./RegisterFurnitureClient";

export default async function RegisterFurniturePage() {
	const user = await getUserFromCookie();
	if (!user) return redirect("/auth/login");

	return <RegisterFurnitureClient />;
}
