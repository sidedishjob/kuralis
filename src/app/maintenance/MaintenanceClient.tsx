"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiArrowLeft, FiCalendar, FiGrid } from "react-icons/fi";
import { MaintenanceTask } from "@/types/maintenance";
import CalendarView from "./CalendarView";
import BoardView from "./BoardView";
import { getMaintenanceTasks } from "@/lib/queries/getMaintenanceTasks";

export default function MaintenanceClient() {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);

	useEffect(() => {
		(async () => {
			const tasks = await getMaintenanceTasks();
			setMaintenanceTasks(tasks);
		})();
	}, []);

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

				<TabsContent value="calendar">
					<CalendarView
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						maintenanceTasks={maintenanceTasks}
					/>
				</TabsContent>
				<TabsContent value="board">
					<BoardView maintenanceTasks={maintenanceTasks} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
