"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiCalendar, FiGrid } from "react-icons/fi";
import type { MaintenanceSummaryItem } from "@/types/maintenance";
import CalendarView from "./CalendarView";
import BoardView from "./BoardView";
import Link from "next/link";

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
				<div className="space-y-1 shrink">
					<h1 className="text-2xl font-bold tracking-tighter-custom">メンテナンス予定</h1>
					<p className="text-sm text-kuralis-600 hidden md:block">
						家具のメンテナンス予定を管理します
					</p>
				</div>
			</div>
			{summary.length === 0 && (
				<div className="pb-2 text-center text-sm text-kuralis-500 mt-12 col-span-full">
					メンテナンス予定がありません。
					<br className="block md:hidden" />
					<Link
						href="/furniture"
						className="text-kuralis-700 underline underline-offset-2 hover:text-kuralis-900 ml-1"
					>
						家具のメンテナンスタスクを登録してください
					</Link>
				</div>
			)}
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
