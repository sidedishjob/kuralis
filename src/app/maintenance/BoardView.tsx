"use client";

import React from "react";
import { format, addDays } from "date-fns";
import type { MaintenanceTask } from "@/types/maintenance";
import { FiAlertCircle, FiCalendar } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface BoardViewProps {
	maintenanceTasks: MaintenanceTask[];
}

/**
 * ボードビューコンポーネント：期限別にメンテナンスタスクを表示
 */
export default function BoardView({ maintenanceTasks }: BoardViewProps) {
	const router = useRouter();
	const now = new Date();
	const in7Days = addDays(now, 7);

	const handleLink = (furnitureId: string) => {
		router.push(`/furniture/${furnitureId}/maintenance`);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* 期限切れ */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-accent-500">
					<FiAlertCircle className="mr-2" />
					期限切れ
				</h3>
				{maintenanceTasks
					.filter((t) => t.nextDate < now)
					.map((task) => (
						<button
							key={task.id}
							onClick={() => handleLink(task.furnitureId)}
							className="block w-full text-left p-4 border border-accent-200 rounded-sm hover:border-accent-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.method}</div>
							<div className="text-xs text-accent-500 mt-2">
								次回予定日: {format(task.nextDate, "yyyy/MM/dd")}
								<br />
								前回実施日: {task.lastDoneAt}
							</div>
						</button>
					))}
			</div>

			{/* 今週予定 */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-kuralis-600">
					<FiCalendar className="mr-2" />
					今週予定
				</h3>
				{maintenanceTasks
					.filter((t) => t.nextDate >= now && t.nextDate <= in7Days)
					.map((task) => (
						<button
							key={task.id}
							onClick={() => handleLink(task.furnitureId)}
							className="block w-full text-left p-4 border border-kuralis-200 rounded-sm hover:border-kuralis-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.method}</div>
							<div className="text-xs text-kuralis-600 mt-2">
								次回予定日: {format(task.nextDate, "yyyy/MM/dd")}
								<br />
								前回実施日: {task.lastDoneAt}
							</div>
						</button>
					))}
			</div>

			{/* 来週以降 */}
			<div className="space-y-4">
				<h3 className="font-bold tracking-tighter-custom flex items-center text-kuralis-600">
					<FiCalendar className="mr-2" />
					来週以降
				</h3>
				{maintenanceTasks
					.filter((t) => t.nextDate > in7Days)
					.map((task) => (
						<button
							key={task.id}
							onClick={() => handleLink(task.furnitureId)}
							className="block w-full text-left p-4 border border-kuralis-200 rounded-sm hover:border-kuralis-300 transition-colors duration-300"
						>
							<div className="text-sm font-bold tracking-tighter-custom">
								{task.furnitureName}
							</div>
							<div className="text-xs text-kuralis-600 mt-1">{task.method}</div>
							<div className="text-xs text-kuralis-600 mt-2">
								次回予定日: {format(task.nextDate, "yyyy/MM/dd")}
								<br />
								前回実施日: {task.lastDoneAt}
							</div>
						</button>
					))}
			</div>
		</div>
	);
}
