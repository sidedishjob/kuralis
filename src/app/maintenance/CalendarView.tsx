"use client";

import React from "react";
import {
	format,
	addDays,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameDay,
	isSameMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import type { MaintenanceSummaryItem } from "@/types/maintenance";
import Link from "next/link";

interface CalendarViewProps {
	selectedDate: Date;
	setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
	maintenanceTasks: MaintenanceSummaryItem[];
}

/**
 * カレンダービューコンポーネント：日別にメンテナンスタスクを表示
 */
export default function CalendarView({
	selectedDate,
	setSelectedDate,
	maintenanceTasks,
}: CalendarViewProps) {
	const days = eachDayOfInterval({
		start: startOfMonth(selectedDate),
		end: endOfMonth(selectedDate),
	});

	const getTasksForDate = (date: Date) =>
		maintenanceTasks.filter(
			(task) => task.nextDueDate !== null && isSameDay(new Date(task.nextDueDate), date)
		);

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-4 flex items-center justify-between">
				<h2 className="text-lg font-bold tracking-tighter-custom">
					{format(selectedDate, "yyyy年 M月", { locale: ja })}
				</h2>
				<div className="flex space-x-2">
					<button
						onClick={() => setSelectedDate((d) => addDays(d, -30))}
						className="p-2 hover:bg-kuralis-50 rounded-sm"
					>
						←
					</button>
					<button
						onClick={() => setSelectedDate(new Date())}
						className="p-2 hover:bg-kuralis-50 rounded-sm text-sm"
					>
						Today
					</button>
					<button
						onClick={() => setSelectedDate((d) => addDays(d, 30))}
						className="p-2 hover:bg-kuralis-50 rounded-sm"
					>
						→
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-px bg-kuralis-200">
				{["日", "月", "火", "水", "木", "金", "土"].map((day) => (
					<div
						key={day}
						className="bg-kuralis-50 p-2 text-center text-sm font-bold tracking-tighter-custom"
					>
						{day}
					</div>
				))}

				{days.map((day) => {
					const tasks = getTasksForDate(day);
					const isToday = isSameDay(day, new Date());
					const isCurrentMonth = isSameMonth(day, selectedDate);

					return (
						<div
							key={day.toISOString()}
							className={`min-h-[80px] md:min-h-[100px] p-1 md:p-2 bg-white ${
								!isCurrentMonth ? "text-kuralis-400" : ""
							}`}
						>
							<div
								className={`text-sm mb-1 font-bold tracking-tighter-custom ${
									isToday ? "text-kuralis-900" : ""
								}`}
							>
								{format(day, "d")}
							</div>

							<div className="space-y-1">
								{tasks.map((task) => (
									<Link
										key={task.taskId}
										href={`/furniture/${task.furnitureId}/maintenance`}
										className="block w-full text-left text-[10px] md:text-xs p-0.5 md:p-1 bg-accent-50 text-accent-500 rounded-sm hover:bg-accent-100 transition-colors duration-300 truncate"
									>
										<span className="hidden md:inline">
											{task.furnitureName}
											<br />
											{task.taskName}
										</span>
										<span className="md:hidden">{task.taskName}</span>
									</Link>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
