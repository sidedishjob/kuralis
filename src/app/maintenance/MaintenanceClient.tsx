"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiCalendar, FiGrid } from "react-icons/fi";
import type { MaintenanceSummaryItem } from "@/types/maintenance";
import CalendarView from "./CalendarView";
import BoardView from "./BoardView";

interface MaintenanceClientProps {
	/** SSR／サーバー関数で取得したメンテナンスサマリー一覧 */
	summary: MaintenanceSummaryItem[];
}

export default function MaintenanceClient({ summary }: MaintenanceClientProps) {
	// カレンダーで選択中の日付
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const maintenanceTasks = summary;

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			{/* ヘッダー */}
			<div className="flex items-center justify-between mb-8">
				<div className="space-y-1 flex-shrink">
					<h1 className="text-2xl font-bold tracking-tighter-custom">メンテナンス予定</h1>
					<p className="text-sm text-kuralis-600 hidden md:block">
						家具のメンテナンス予定を管理します
					</p>
				</div>
			</div>

			{/* タブ切り替え */}
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
