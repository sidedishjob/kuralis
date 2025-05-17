import { sampleMaintenanceItems } from "@/data/sampleMaintenanceItems";

export async function getSampleMaintenanceItems() {
	// 将来的に Supabase 等で置換可能な構成
	return sampleMaintenanceItems;
}
