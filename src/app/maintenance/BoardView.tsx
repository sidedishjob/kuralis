"use client";

import React from "react";
import { format, addDays } from "date-fns";
import type { MaintenanceSummaryItem } from "@/types/maintenance";
import { FiAlertCircle, FiCalendar } from "react-icons/fi";
import Link from "next/link";

interface BoardViewProps {
	maintenanceTasks: MaintenanceSummaryItem[];
}

/**
 * ボードビューコンポーネント：期限別にメンテナンスタスクを表示
 */
export default function BoardView({ maintenanceTasks }: BoardViewProps) {
	const now = new Date();
	const in7Days = addDays(now, 7);

	// nullを除外したうえで日付を比較できるよう変換
	const tasksWithDueDate = maintenanceTasks.filter((t) => t.nextDueDate !== null);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* 期限切れ */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-accent-500">
					<FiAlertCircle className="mr-2" />
					期限切れ
				</h3>
				{tasksWithDueDate
					.filter(
						(t) =>
							t.nextDueDate !== null &&
							new Date(t.nextDueDate).setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)
					)
					.map((task) => (
						<Link
							key={task.taskId}
							href={`/furniture/${task.furnitureId}/maintenance`}
							className="block w-full text-left p-4 border border-accent-200 rounded-sm hover:border-accent-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.taskName}</div>
							<div className="text-xs text-accent-500 mt-2">
								次回予定日: {format(new Date(task.nextDueDate!), "yyyy/MM/dd")}
								<br />
								前回実施日: {format(new Date(task.lastPerformedAt), "yyyy/MM/dd")}
							</div>
						</Link>
					))}
			</div>

			{/* 今週予定 */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-kuralis-600">
					<FiCalendar className="mr-2" />
					今週予定
				</h3>
				{tasksWithDueDate
					.filter((t) => {
						const due = new Date(t.nextDueDate!);
						return due >= now && due <= in7Days;
					})
					.map((task) => (
						<Link
							key={task.taskId}
							href={`/furniture/${task.furnitureId}/maintenance`}
							className="block w-full text-left p-4 border border-kuralis-200 rounded-sm hover:border-kuralis-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.taskName}</div>
							<div className="text-xs text-kuralis-600 mt-2">
								次回予定日: {format(new Date(task.nextDueDate!), "yyyy/MM/dd")}
								<br />
								前回実施日: {format(new Date(task.lastPerformedAt), "yyyy/MM/dd")}
							</div>
						</Link>
					))}
			</div>

			{/* 来週以降 */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-kuralis-600">
					<FiCalendar className="mr-2" />
					来週以降
				</h3>
				{tasksWithDueDate
					.filter((t) => new Date(t.nextDueDate!) > in7Days)
					.map((task) => (
						<Link
							key={task.taskId}
							href={`/furniture/${task.furnitureId}/maintenance`}
							className="block w-full text-left p-4 border border-kuralis-200 rounded-sm hover:border-kuralis-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.taskName}</div>
							<div className="text-xs text-kuralis-600 mt-2">
								次回予定日: {format(new Date(task.nextDueDate!), "yyyy/MM/dd")}
								<br />
								前回実施日: {format(new Date(task.lastPerformedAt), "yyyy/MM/dd")}
							</div>
						</Link>
					))}
			</div>
		</div>
	);
}
