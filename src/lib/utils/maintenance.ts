import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import type { MaintenanceCycleUnit } from "@/types/maintenance";

/**
 * 次回予定日を算出する関数
 * @param performedAt 実施日（ISO文字列）
 * @param cycleValue サイクル値（数値）
 * @param cycleUnit サイクル単位（"days", "weeks", "months", "years"）
 * @returns 次回予定日（Dateオブジェクト）
 */
export function calculateNextDueDate(
	performedAt: string,
	cycleValue: number,
	cycleUnit: MaintenanceCycleUnit
): Date {
	const baseDate = new Date(performedAt);

	switch (cycleUnit) {
		case "days":
			return addDays(baseDate, cycleValue);
		case "weeks":
			return addWeeks(baseDate, cycleValue);
		case "months":
			return addMonths(baseDate, cycleValue);
		case "years":
			return addYears(baseDate, cycleValue);
		default:
			throw new Error(`Unsupported cycle unit: ${cycleUnit}`);
	}
}
