import type { MaintenanceItem } from "@/types/maintenance";

export const sampleMaintenanceItems: MaintenanceItem[] = [
	{
		id: "1",
		method: "オイルメンテ",
		cycle: "90日周期",
		history: [
			{ id: "1", date: "2025/01/01" },
			{ id: "2", date: "2025/04/01" },
		],
	},
	{
		id: "2",
		method: "ネジゆるみチェック",
		cycle: "180日周期",
		history: [{ id: "1", date: "2025/03/15" }],
	},
];
