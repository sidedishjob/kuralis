"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiGrid, FiAlertCircle } from "react-icons/fi";
import {
	format,
	addDays,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
} from "date-fns";
import { ja } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sampleFurniture } from "@/data/sampleFurniture";

interface MaintenanceTask {
	id: string;
	furnitureId: string;
	furnitureName: string;
	method: string;
	nextDate: Date;
	cycle: string;
	lastDoneAt: string;
}

const MaintenanceDashboardPage: React.FC = () => {
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [maintenanceTasks] = useState<MaintenanceTask[]>([
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
	]);

	const days = eachDayOfInterval({
		start: startOfMonth(selectedDate),
		end: endOfMonth(selectedDate),
	});

	const getTasksForDate = (date: Date) =>
		maintenanceTasks.filter((task) => isSameDay(task.nextDate, date));

	const handleLink = (furnitureId: string) => {
		router.push(`/furniture/${furnitureId}/maintenance`);
	};

	const renderCalendarView = () => (
		<div className="bg-white rounded-lg shadow">
			<div className="p-4 flex items-center justify-between">
				<h2 className="text-lg font-bold tracking-tighter-custom">
					{format(selectedDate, "yyyy年 M月", { locale: ja })}
				</h2>
				<div className="flex space-x-2">
					<button
						onClick={() => setSelectedDate((d) => addDays(d, -30))}
						className="p-2 hover:bg-kuralis-50 rounded-sm transition-colors duration-300"
					>
						←
					</button>
					<button
						onClick={() => setSelectedDate(new Date())}
						className="p-2 hover:bg-kuralis-50 rounded-sm transition-colors duration-300 text-sm"
					>
						Today
					</button>
					<button
						onClick={() => setSelectedDate((d) => addDays(d, 30))}
						className="p-2 hover:bg-kuralis-50 rounded-sm transition-colors duration-300"
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
									<button
										key={task.id}
										onClick={() => handleLink(task.furnitureId)}
										className="w-full text-left text-[10px] md:text-xs p-0.5 md:p-1 bg-accent-50 text-accent-500 rounded-sm hover:bg-accent-100 transition-colors duration-300 truncate"
									>
										<span className="hidden md:inline">
											{task.furnitureName}
											<br />
											{task.method}
										</span>
										<span className="md:hidden">{task.method}</span>
									</button>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);

	const renderBoardView = () => {
		const now = new Date();
		const in7Days = addDays(now, 7);

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
	};

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<div className="flex items-center justify-between mb-8">
				<div className="space-y-1 flex-shrink">
					<h1 className="text-2xl font-bold tracking-tighter-custom">メンテナンス管理</h1>
					<p className="text-sm text-kuralis-600 hidden md:block">
						家具のメンテナンス予定を管理します
					</p>
				</div>
				<button
					onClick={() => router.push("/furniture")}
					className="text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 inline-flex items-center text-sm font-bold tracking-tighter-custom flex-shrink-0"
				>
					<FiArrowLeft className="mr-2" />
					<span className="hidden md:inline">コレクションに戻る</span>
					<span className="md:hidden">戻る</span>
				</button>
			</div>

			<Tabs defaultValue="calendar" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="calendar" className="flex items-center">
						<FiCalendar className="mr-2" />
						カレンダー
					</TabsTrigger>
					<TabsTrigger value="board" className="flex items-center">
						<FiGrid className="mr-2" />
						ボード
					</TabsTrigger>
				</TabsList>

				<TabsContent value="calendar">{renderCalendarView()}</TabsContent>
				<TabsContent value="board">{renderBoardView()}</TabsContent>
			</Tabs>
		</div>
	);
};

export default MaintenanceDashboardPage;
