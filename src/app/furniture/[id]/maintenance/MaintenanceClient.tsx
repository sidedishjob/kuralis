"use client";

import React, { useState } from "react";
import { FiArrowLeft, FiCalendar, FiPlus, FiTool, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import type { Furniture } from "@/types/furniture_new";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAddMaintenanceRecord } from "@/hooks/useAddMaintenanceRecord";
import { useMaintenanceTasks } from "@/hooks/useMaintenanceTasks";
import { useDeleteMaintenanceRecord } from "@/hooks/useDeleteMaintenanceRecord";
import { useAddMaintenanceTask } from "@/hooks/useAddMaintenanceTask";
import Link from "next/link";
import { MaintenanceCycleUnit } from "@/types/maintenance";

interface Props {
	furniture: Furniture;
}

const unitMap: Record<MaintenanceCycleUnit, string> = {
	days: "日",
	weeks: "週",
	months: "ヶ月",
	years: "年",
};

export default function MaintenanceClient({ furniture }: Props) {
	const getTodayDate = () => new Date().toISOString().split("T")[0];

	const [isAddingItem, setIsAddingItem] = useState(false);
	const [isAddingHistory, setIsAddingHistory] = useState<string | null>(null);
	const [newItem, setNewItem] = useState({ taskName: "", cycleValue: "", cycleUnit: "" });
	const [newHistoryDate, setNewHistoryDate] = useState(getTodayDate);

	const { tasks, isLoading, error, mutate } = useMaintenanceTasks(furniture.id);
	const { addTask } = useAddMaintenanceTask(furniture.id);
	const addRecord = useAddMaintenanceRecord();
	const deleteRecord = useDeleteMaintenanceRecord();

	const handleAddTask = async () => {
		if (!newItem.taskName) return;

		const cycleValue = parseInt(newItem.cycleValue);
		if (newItem.cycleValue && (isNaN(cycleValue) || cycleValue < 0)) {
			toast({ title: "周期は正の数値で入力してください" });
			return;
		}

		try {
			await addTask({
				taskName: newItem.taskName,
				cycleValue: newItem.cycleValue,
				cycleUnit: newItem.cycleUnit,
			});
			await mutate();

			setNewItem({ taskName: "", cycleValue: "", cycleUnit: "" });
			setIsAddingItem(false);
			toast({ title: "メンテナンス項目を追加しました" });
		} catch (error) {
			console.error(error);
			toast({
				title: "登録失敗",
				description:
					error instanceof Error ? error.message : "予期しないエラーが発生しました",
			});
		}
	};

	/**
	 * メンテナンス履歴登録
	 */
	const handleAddHistory = async (taskId: string) => {
		if (!newHistoryDate) return;

		try {
			await addRecord(taskId, newHistoryDate);
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

	/**
	 * メンテナンス履歴削除
	 */
	const handleDeleteHistory = async (recordId: string) => {
		try {
			await deleteRecord(recordId);
			await mutate();
			toast({ title: "メンテナンス履歴を削除しました" });
		} catch (err) {
			console.error(err);
			toast({ title: "削除失敗", description: "もう一度お試しください" });
		}
	};

	if (isLoading) return <p>読み込み中...</p>;
	if (error) return <p className="text-red-500">エラーが発生しました</p>;

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<Link
				href={`/furniture/${furniture.id}`}
				className="inline-flex items-center text-kuralis-600 hover:text-kuralis-900 mb-8 transition-colors duration-300 group font-normal tracking-tighter-custom"
			>
				<FiArrowLeft
					size={16}
					className="mr-2 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-400 ease-natural"
				/>
				<span>家具の詳細に戻る</span>
			</Link>

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

				{tasks.length === 0 ? (
					<div className="text-center py-12 border-2 border-dashed border-kuralis-200 rounded-sm">
						<FiTool size={32} className="mx-auto text-kuralis-400 mb-4" />
						<p className="text-kuralis-600 font-bold tracking-tighter-custom">
							メンテナンス項目がありません
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{tasks.map((task) => (
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
											{unitMap[task.cycle_unit] ?? task.cycle_unit}
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
											className="flex items-center justify-between group"
										>
											<div className="flex items-center space-x-2 text-sm text-kuralis-600">
												<FiCalendar size={18} />
												<span className="font-bold tracking-tighter-custom">
													{record.performed_at}
												</span>
												<span className="text-kuralis-400">実施</span>
											</div>
											<Dialog>
												<DialogTrigger asChild>
													<button className="opacity-0 group-hover:opacity-100 text-kuralis-400 hover:text-accent-500 transition-all duration-300">
														<FiTrash2 size={18} />
													</button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>
															メンテナンス履歴を削除しますか？
														</DialogTitle>
														<DialogDescription>
															この操作は取り消せません。本当に削除しますか？
														</DialogDescription>
													</DialogHeader>
													<DialogFooter className="mt-4">
														<button
															onClick={() =>
																handleDeleteHistory(record.id)
															}
															className="px-4 py-2 bg-accent-500 text-white rounded-sm hover:bg-accent-400 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
														>
															削除する
														</button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
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
									メンテナンス項目名
								</label>
								<input
									type="text"
									value={newItem.taskName}
									onChange={(e) =>
										setNewItem({ ...newItem, taskName: e.target.value })
									}
									className="w-full px-3 py-2 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
									placeholder="例：オイルメンテナンス"
								/>
							</div>
							<div>
								<label className="block text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-2">
									実施周期
								</label>
								<input
									type="number"
									value={newItem.cycleValue}
									onChange={(e) =>
										setNewItem({ ...newItem, cycleValue: e.target.value })
									}
									className=" px-3 py-2 w-1/3 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
									placeholder="例：90"
									min="1"
									step="1"
									inputMode="numeric"
								/>
								<select
									value={newItem.cycleUnit}
									onChange={(e) =>
										setNewItem({ ...newItem, cycleUnit: e.target.value })
									}
									className="ml-2 px-3 py-2 border border-kuralis-200 rounded-sm"
								>
									{Object.entries(unitMap).map(([key, value]) => (
										<option value={key} key={key}>
											{value}
										</option>
									))}
								</select>
								<span className="pl-1 text-sm text-kuralis-600">
									ごとにメンテナンス
								</span>
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
								onClick={() => handleAddTask()}
								disabled={!newItem.taskName || !newItem.cycleValue}
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
