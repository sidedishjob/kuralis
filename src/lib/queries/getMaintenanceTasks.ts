import { sampleMaintenanceTasks } from "@/data/sampleMaintenance";

export async function getMaintenanceTasks() {
	// 将来的には Supabase fetch に差し替え
	return sampleMaintenanceTasks;
}
