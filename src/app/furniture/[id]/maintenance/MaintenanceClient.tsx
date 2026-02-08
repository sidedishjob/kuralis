"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiCalendar, FiPlus, FiX, FiTool, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { maintenanceTaskSchema, MaintenanceTaskSchema } from "@/lib/validation";
import { ErrorMessage } from "@/components/common/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useMaintenanceTasks } from "@/hooks/useMaintenanceTasks";
import { useAddMaintenanceRecord } from "@/hooks/useAddMaintenanceRecord";
import { useDeleteMaintenanceRecord } from "@/hooks/useDeleteMaintenanceRecord";
import { useAddMaintenanceTask } from "@/hooks/useAddMaintenanceTask";
import { useUpdateMaintenanceTask } from "@/hooks/useUpdateMaintenanceTask";
import type { Furniture } from "@/types/furniture";
import type { MaintenanceCycleUnit } from "@/types/maintenance";

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
	const { isGuestUser } = useAuth();
	const { toast } = useToast();

	const { tasks, isLoading, error, mutate } = useMaintenanceTasks(furniture.id);
	const { addTask } = useAddMaintenanceTask(furniture.id);
	const { addRecord } = useAddMaintenanceRecord();
	const { deleteRecord } = useDeleteMaintenanceRecord();
	const { updateTaskActive } = useUpdateMaintenanceTask(furniture.id);

	const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false); // ダイアログOPEN用
	const [isTaskAdding, setIsTaskAdding] = useState(false); // タスク追加Loading用
	const [addingHistoryId, setAddingHistoryId] = useState<string | null>(null); //履歴追加Loading用
	const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null); // 履歴削除Loading用
	const [newHistoryDate, setNewHistoryDate] = useState(getTodayDate);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<MaintenanceTaskSchema>({
		resolver: zodResolver(maintenanceTaskSchema),
		defaultValues: {
			taskName: "",
			cycleValue: "",
			cycleUnit: "months",
		},
		mode: "onChange",
	});

	/**
	 * メンテナンスタスク追加
	 */
	const onSubmit = async (data: MaintenanceTaskSchema) => {
		setIsTaskAdding(true);
		try {
			await addTask(data);
			await mutate();

			reset();
			setIsAddTaskDialogOpen(false);

			toast({ title: "メンテナンスタスクを追加しました" });
		} catch (error: unknown) {
			console.error("メンテナンス項追加エラー:", error);
			toast({
				title: "メンテナンスタスクの追加に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		} finally {
			setIsTaskAdding(false);
		}
	};

	/**
	 * メンテナンス履歴追加
	 */
	const handleAddHistory = async (taskId: string) => {
		if (!newHistoryDate) return;

		setAddingHistoryId(taskId);
		try {
			await addRecord(taskId, newHistoryDate);
			await mutate();

			setNewHistoryDate(getTodayDate);
			setDeletingHistoryId(null);
			toast({ title: "メンテナンス履歴を追加しました" });
		} catch (error: unknown) {
			console.error("メンテナンス履歴追加エラー:", error);
			toast({
				title: "メンテナンス履歴の追加に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		} finally {
			setAddingHistoryId(null);
		}
	};

	/**
	 * メンテナンス履歴削除
	 */
	const handleDeleteHistory = async (recordId: string) => {
		setDeletingHistoryId(recordId);
		try {
			await deleteRecord(recordId);
			await mutate();
			toast({ title: "メンテナンス履歴を削除しました" });
		} catch (error: unknown) {
			console.error("メンテナンス履歴削除エラー:", error);
			toast({
				title: "メンテナンス履歴の削除に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		} finally {
			setDeletingHistoryId(null);
		}
	};

	/**
	 * メンテナンス状態の更新
	 */
	const handleUpdateTaskActive = async (taskId: string, checked: boolean) => {
		try {
			await updateTaskActive(taskId, checked);
			await mutate();
			toast({ title: "メンテナンス状態を更新しました" });
		} catch (error: unknown) {
			console.error("メンテナンス状態更新エラー:", error);
			toast({
				title: "メンテナンス状態の更新に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		}
	};

	if (error)
		return (
			<ErrorMessage
				error={error}
				onRetry={() => mutate()}
				className="mx-auto mt-10 max-w-md"
			/>
		);

	return (
		<div className="container mx-auto py-6 md:py-12 px-6 md:px-12">
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
						{furniture.name}のメンテナンス管理
					</h1>
					<Button
						onClick={() => setIsAddTaskDialogOpen(true)}
						className="hidden md:block w-10 h-10 rounded-full bg-kuralis-900 hover:bg-kuralis-800 transition-colors duration-300 tracking-tighter-custom"
					>
						<FiPlus size={16} />
					</Button>
				</div>
				{isLoading ? (
					// ローディング中のSkeletonやプレースホルダー
					<div className="mb-6 space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="h-14 bg-kuralis-100 rounded-sm animate-pulse" />
						))}
					</div>
				) : tasks.length === 0 ? (
					<div className="text-center mb-6 py-12 border-2 border-dashed border-kuralis-200 rounded-sm">
						<FiTool size={32} className="mx-auto text-kuralis-400 mb-4" />
						<p className="text-kuralis-600 tracking-tighter-custom">
							メンテナンスタスクが追加されていません
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						{tasks.map((task) => (
							<div
								key={task.id}
								className={`flex flex-col p-6 border border-kuralis-200 rounded-sm ${task.is_active ? "" : "opacity-50"}`}
							>
								<div className="flex items-center space-x-3 mb-4">
									<div className="text-kuralis-600">
										<FiTool className="w-5 h-5" />
									</div>
									<div className="grow">
										<h3 className="tracking-tighter-custom text-lg">
											{task.name}
										</h3>
										<p className="text-sm text-kuralis-600">
											実施周期：
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
											<div className="tracking-tighter-custom">
												次回予定日
											</div>
											<div className="mt-1">
												{format(new Date(task.next_due_date), "yyyy/MM/dd")}
											</div>
										</div>
									)}
								</div>
								<div className="mb-2 md:ml-8">
									{deletingHistoryId === task.id ? (
										<div className="h-8 flex items-center space-x-2">
											<input
												type="date"
												value={newHistoryDate}
												onChange={(e) => setNewHistoryDate(e.target.value)}
												className="text-sm border border-kuralis-200 rounded-sm px-2 py-1"
											/>
											<LoadingButton
												type="button"
												onClick={() => handleAddHistory(task.id)}
												isLoading={addingHistoryId === task.id}
												loadingText=""
												disabled={!newHistoryDate}
												variant="ghost"
												forceMinWidth={false}
												className="p-1 w-8 h-8 inline-flex items-center justify-center text-kuralis-900 hover:text-kuralis-700 disabled:text-kuralis-400"
											>
												<FiPlus
													size={14}
													className="w-10 h-10 rounded-full bg-kuralis-900 hover:bg-kuralis-800 transition-colors duration-300 tracking-tighter-custom text-white"
												/>
											</LoadingButton>
											<button
												onClick={() => {
													setDeletingHistoryId(null);
													setNewHistoryDate(getTodayDate);
												}}
												disabled={addingHistoryId === task.id}
												className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
											>
												<FiX size={14} />
											</button>
										</div>
									) : (
										<button
											onClick={() => setDeletingHistoryId(task.id)}
											className="h-8 text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom inline-flex items-center"
										>
											<FiPlus size={14} className="mr-1" />
											<span>新しい履歴を追加</span>
										</button>
									)}

									{/* スクロールコンテナ */}
									<div
										className={`space-y-1 ${
											task.records.length >= 5
												? "max-h-[7.5rem] overflow-y-auto pr-1"
												: ""
										}`}
									>
										{task.records.map((record) => (
											<div
												key={record.id}
												className="flex items-center justify-start group"
											>
												<div className="flex items-center space-x-2 text-sm text-kuralis-600">
													<FiCalendar size={18} />
													<span className="tracking-tighter-custom">
														{record.performed_at}
													</span>
													<span className="text-kuralis-400">実施</span>
												</div>
												<Dialog>
													<DialogTrigger asChild>
														<button className="ml-3 md:opacity-0 group-hover:opacity-100 text-kuralis-400 hover:text-accent-500 transition-all duration-300">
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
															<LoadingButton
																type="button"
																variant="destructive"
																onClick={() =>
																	handleDeleteHistory(record.id)
																}
																isLoading={
																	deletingHistoryId === record.id
																}
																loadingText="削除中..."
																className="w-full"
															>
																削除する
															</LoadingButton>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</div>
										))}
									</div>
								</div>
								<div className="mt-auto p-2 flex items-center justify-between bg-kuralis-100 rounded-sm">
									<span className="text-sm text-kuralis-600">タスクの状態</span>
									<Switch
										checked={task.is_active}
										disabled={isGuestUser}
										onCheckedChange={(checked) =>
											handleUpdateTaskActive(task.id, checked)
										}
										aria-label={`「${task.name}」を${task.is_active ? "無効" : "有効"}にする`}
										className="data-[state=checked]:bg-kuralis-900"
									/>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="md:hidden w-full flex items-center justify-center">
					<Button
						onClick={() => setIsAddTaskDialogOpen(true)}
						className="w-10 h-10 rounded-full bg-kuralis-900 hover:bg-kuralis-800 transition-colors duration-300 tracking-tighter-custom"
					>
						<FiPlus size={16} />
					</Button>
				</div>

				{/* ダイアログ（タスク追加） */}
				<Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>メンテナンスタスクの追加</DialogTitle>
							<DialogDescription>
								タスク名と実施周期を入力して追加します。
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
							<div>
								<label className="block text-sm tracking-tighter-custom text-kuralis-600 mb-2">
									メンテナンスタスク名
								</label>
								<input
									type="text"
									{...register("taskName")}
									className="w-full px-3 py-2 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
									placeholder="例：オイルメンテナンス"
								/>
								{errors.taskName && (
									<p className="text-sm text-red-500 mt-1">
										{errors.taskName.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm tracking-tighter-custom text-kuralis-600 mb-2">
									実施周期
								</label>
								<div className="flex items-center">
									<input
										type="number"
										{...register("cycleValue")}
										className=" px-3 py-2 w-1/3 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none"
										placeholder="例：90"
										min="1"
										step="1"
										inputMode="numeric"
									/>
									<select
										{...register("cycleUnit")}
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
								{errors.cycleValue && (
									<p className="text-sm text-red-500 mt-1">
										{errors.cycleValue.message}
									</p>
								)}
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setIsAddTaskDialogOpen(false);
										reset();
									}}
									className="mt-2 transition-all duration-300 transform hover:-translate-y-0.5 tracking-tighter-custom"
								>
									キャンセル
								</Button>
								<LoadingButton
									type="submit"
									isLoading={isTaskAdding}
									loadingText="追加中..."
									disabled={!isValid}
									className="w-full md:w-auto mt-2 bg-kuralis-900 hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 tracking-tighter-custom"
								>
									追加する
								</LoadingButton>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
