"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiPlus, FiTool } from "react-icons/fi";
import { format } from "date-fns";
import type { Furniture } from "@/types/furniture_new";
import type { MaintenanceTaskWithRecords } from "@/types/maintenance";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAddMaintenanceRecord } from "@/hooks/useAddMaintenanceRecord";
import { useMaintenanceTasks } from "@/hooks/useMaintenanceTasks";
import { API_ROUTES } from "@/lib/api/route";

interface Props {
	furniture: Furniture;
	initialMaintenanceItems: MaintenanceTaskWithRecords[];
}

export default function MaintenanceClient({ furniture, initialMaintenanceItems }: Props) {
	const router = useRouter();
	const getTodayDate = () => new Date().toISOString().split("T")[0];

	const [maintenanceItems, setMaintenanceItems] = useState(initialMaintenanceItems);

	const [isAddingItem, setIsAddingItem] = useState(false);
	const [isAddingHistory, setIsAddingHistory] = useState<string | null>(null);
	const [newItem, setNewItem] = useState({ method: "", cycle: "" });
	const [newHistoryDate, setNewHistoryDate] = useState(getTodayDate);

	const { tasks, isLoading, error, mutate } = useMaintenanceTasks(
		furniture.id,
		initialMaintenanceItems
	);
	const addRecord = useAddMaintenanceRecord();

	const handleAddItem = () => {
		if (!newItem.method) return;

		setNewItem({ method: "", cycle: "" });
		setIsAddingItem(false);
		toast({ title: "メンテナンス項目を追加しました" });
	};

	/**
	 * メンテナンス履歴登録
	 * @param taskId
	 * @returns
	 */
	const handleAddHistory = async (taskId: string) => {
		if (!newHistoryDate) return;

		try {
			await addRecord(taskId, newHistoryDate);
			// 成功時：stateに追加 or mutate()
			await mutate();

			setNewHistoryDate(getTodayDate);
			setIsAddingHistory(null);
			toast({ title: "メンテナンス履歴を追加しました" });
		} catch (error) {
			console.error("登録エラー:", error);
			toast({
				title: "登録失敗",
				description:
					error instanceof Error ? error.message : "予期しないエラーが発生しました",
			});
		}
	};

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<button
				onClick={() => router.push(`/furniture/${furniture.id}`)}
				className="inline-flex items-center text-kuralis-600 hover:text-kuralis-900 mb-8 transition-colors duration-300 group font-normal tracking-tighter-custom"
			>
				<FiArrowLeft
					size={16}
					className="mr-2 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-400 ease-natural"
				/>
				<span>家具の詳細に戻る</span>
			</button>

			<div className="max-w-3xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl font-bold tracking-tighter-custom">
						{furniture.name}のメンテナンス記録
					</h1>
					<button
						onClick={() => setIsAddingItem(true)}
						className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
					>
						<FiPlus size={16} className="mr-2" />
						<span>新しい項目を追加</span>
					</button>
				</div>

				{maintenanceItems.length === 0 ? (
					<div className="text-center py-12 border-2 border-dashed border-kuralis-200 rounded-sm">
						<FiTool size={32} className="mx-auto text-kuralis-400 mb-4" />
						<p className="text-kuralis-600 font-bold tracking-tighter-custom">
							メンテナンス項目がありません
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{maintenanceItems.map((task) => (
							<div key={task.id} className="p-6 border border-kuralis-200 rounded-sm">
								<div className="flex items-center space-x-3 mb-4">
									<div className="text-kuralis-600">
										<FiTool className="w-5 h-5" />
									</div>
									<div className="flex-grow">
										<h3 className="font-bold tracking-tighter-custom text-lg">
											{task.name}
										</h3>
										<p className="text-sm text-kuralis-600">
											{task.cycle_value}
											{task.cycle_unit === "days" ? "日" : task.cycle_unit}
											ごと
										</p>
									</div>
									{task.next_due_date && (
										<div
											className={`px-3 py-2 rounded-sm text-sm ${
												new Date(task.next_due_date) < new Date()
													? "bg-accent-50 text-accent-500"
													: "bg-kuralis-50 text-kuralis-600"
											}`}
										>
											<div className="font-bold tracking-tighter-custom">
												次回予定日
											</div>
											<div className="mt-1">
												{format(new Date(task.next_due_date), "yyyy/MM/dd")}
											</div>
										</div>
									)}
								</div>
								<div className="space-y-2 ml-8">
									{task.records.map((record) => (
										<div
											key={record.id}
											className="flex items-center space-x-2 text-sm text-kuralis-600"
										>
											<FiCalendar size={14} />
											<span className="font-bold tracking-tighter-custom">
												{record.performed_at}
											</span>
											<span className="text-kuralis-400">実施</span>
										</div>
									))}

									{isAddingHistory === task.id ? (
										<div className="flex items-center space-x-2">
											<input
												type="date"
												value={newHistoryDate}
												onChange={(e) => setNewHistoryDate(e.target.value)}
												className="text-sm border border-kuralis-200 rounded-sm px-2 py-1"
											/>
											<button
												onClick={() => handleAddHistory(task.id)}
												disabled={!newHistoryDate}
												className="text-sm text-kuralis-900 hover:text-kuralis-700 disabled:text-kuralis-400 transition-colors duration-300 font-bold tracking-tighter-custom"
											>
												追加
											</button>
											<button
												onClick={() => {
													setIsAddingHistory(null);
													setNewHistoryDate(getTodayDate);
												}}
												className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
											>
												キャンセル
											</button>
										</div>
									) : (
										<button
											onClick={() => setIsAddingHistory(task.id)}
											className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom inline-flex items-center"
										>
											<FiPlus size={14} className="mr-1" />
											<span>新しい履歴を追加</span>
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{/* ダイアログ（項目追加） */}
				<Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>メンテナンス項目の追加</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div>
								<label className="block text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-2">
									メンテナンス項目名 *
								</label>
								<input
									type="text"
									value={newItem.method}
									onChange={(e) =>
										setNewItem({ ...newItem, method: e.target.value })
									}
									className="w-full px-3 py-2 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
									placeholder="例：オイルメンテナンス"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-2">
									推奨周期
								</label>
								<input
									type="text"
									value={newItem.cycle}
									onChange={(e) =>
										setNewItem({ ...newItem, cycle: e.target.value })
									}
									className="w-full px-3 py-2 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
									placeholder="例：90日周期推奨"
								/>
							</div>
						</div>
						<DialogFooter>
							<button
								onClick={() => setIsAddingItem(false)}
								className="px-4 py-2 border border-kuralis-200 rounded-sm hover:bg-kuralis-50 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
							>
								キャンセル
							</button>
							<button
								onClick={handleAddItem}
								disabled={!newItem.method}
								className="px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom disabled:bg-kuralis-200 disabled:cursor-not-allowed"
							>
								追加する
							</button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
