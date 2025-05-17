import { MaintenanceTask } from "@/types/maintenance";

export const sampleMaintenanceTasks: MaintenanceTask[] = [
	{
		id: "1",
		furnitureId: "1",
		furnitureName: "ウォールナットダイニングテーブル",
		method: "オイルメンテナンス",
		nextDate: new Date("2025-07-01"),
		cycle: "90日周期",
		lastDoneAt: "2025/04/01",
	},
	{
		id: "2",
		furnitureId: "2",
		furnitureName: "オーク本棚",
		method: "除塵",
		nextDate: new Date("2025-03-15"),
		cycle: "30日周期",
		lastDoneAt: "2025/02/15",
	},
];
