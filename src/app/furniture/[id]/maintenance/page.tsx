"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	FiArrowLeft,
	FiCalendar,
	FiTool,
	FiPlus,
	FiTrash2,
	FiDroplet,
	FiTool as FiToolIcon,
} from "react-icons/fi";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addDays, format, parseISO } from "date-fns";
import { sampleFurniture } from "@/data/sampleFurniture";

interface MaintenanceHistory {
	id: string;
	date: string;
}

interface MaintenanceItem {
	id: string;
	icon: React.ReactNode;
	method: string;
	cycle: string;
	history: MaintenanceHistory[];
	nextDate?: Date;
}

const parseCycle = (cycleText: string) => {
	const match = cycleText.match(/(\d+)日/);
	if (match) {
		return {
			days: parseInt(match[1], 10),
			text: cycleText,
		};
	}
	return null;
};

const calculateNextDate = (lastDate: string, cycleDays: number): Date => {
	return addDays(parseISO(lastDate.replace(/\//g, "-")), cycleDays);
};

const MaintenancePage: React.FC = () => {
	const params = useParams();
	const router = useRouter();
	const { user } = useAuth();
	const { toast } = useToast();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

	const furniture = sampleFurniture.find((item) => item.id === id);

	const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([
		{
			id: "1",
			icon: <FiDroplet className="w-5 h-5" />,
			method: "オイルメンテ",
			cycle: "90日周期",
			history: [
				{ id: "1", date: "2025/01/01" },
				{ id: "2", date: "2025/04/01" },
			],
			nextDate: new Date("2025-07-01"),
		},
		{
			id: "2",
			icon: <FiToolIcon className="w-5 h-5" />,
			method: "ネジゆるみチェック",
			cycle: "180日周期",
			history: [{ id: "1", date: "2025/03/15" }],
			nextDate: new Date("2025-09-12"),
		},
	]);

	const [isAddingItem, setIsAddingItem] = useState(false);
	const [isAddingHistory, setIsAddingHistory] = useState<string | null>(null);
	const [newItem, setNewItem] = useState({ method: "", cycle: "" });
	const [newHistoryDate, setNewHistoryDate] = useState("");

	const handleAddItem = () => {
		if (!newItem.method) return;

		const item: MaintenanceItem = {
			id: Math.random().toString(),
			icon: <FiTool className="w-5 h-5" />,
			method: newItem.method,
			cycle: newItem.cycle,
			history: [],
		};

		setMaintenanceItems([...maintenanceItems, item]);
		setNewItem({ method: "", cycle: "" });
		setIsAddingItem(false);
		toast({ title: "メンテナンス項目を追加しました" });
	};

	const handleAddHistory = (itemId: string) => {
		if (!newHistoryDate) return;

		const targetItem = maintenanceItems.find((item) => item.id === itemId);
		const cycleInfo = targetItem ? parseCycle(targetItem.cycle) : null;

		setMaintenanceItems((items) =>
			items.map((item) =>
				item.id === itemId
					? {
							...item,
							history: [
								...item.history,
								{ id: Math.random().toString(), date: newHistoryDate },
							].sort(
								(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
							),
							nextDate: cycleInfo
								? calculateNextDate(newHistoryDate, cycleInfo.days)
								: undefined,
						}
					: item
			)
		);

		setNewHistoryDate("");
		setIsAddingHistory(null);
		toast({ title: "メンテナンス履歴を追加しました" });
	};

	const handleDeleteHistory = (itemId: string, historyId: string) => {
		setMaintenanceItems((items) =>
			items.map((item) =>
				item.id === itemId
					? {
							...item,
							history: item.history.filter((h) => h.id !== historyId),
						}
					: item
			)
		);
	};

	if (!furniture) {
		return (
			<div className="container mx-auto py-16 px-6 md:px-12 text-center">
				<p>家具が見つかりませんでした。</p>
				<button
					onClick={() => router.push("/furniture")}
					className="text-kuralis-600 hover:text-kuralis-900 mt-4 inline-block"
				>
					コレクションに戻る
				</button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<button
				onClick={() => router.push(`/furniture/${id}`)}
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
					{user && (
						<button
							onClick={() => setIsAddingItem(true)}
							className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
						>
							<FiPlus size={16} className="mr-2" />
							<span>新しい項目を追加</span>
						</button>
					)}
				</div>

				{maintenanceItems.length === 0 ? (
					<div className="text-center py-12 border-2 border-dashed border-kuralis-200 rounded-sm">
						<FiTool size={32} className="mx-auto text-kuralis-400 mb-4" />
						<p className="text-kuralis-600 font-bold tracking-tighter-custom">
							メンテナンス項目がありません
						</p>
						{user && (
							<button
								onClick={() => setIsAddingItem(true)}
								className="mt-4 text-kuralis-900 hover:text-kuralis-700 transition-colors duration-300 text-sm font-bold tracking-tighter-custom"
							>
								項目を追加する
							</button>
						)}
					</div>
				) : (
					<div className="space-y-4">
						{maintenanceItems.map((item) => (
							<div key={item.id} className="p-6 border border-kuralis-200 rounded-sm">
								<div className="flex items-center space-x-3 mb-4">
									<div className="text-kuralis-600">{item.icon}</div>
									<div className="flex-grow">
										<h3 className="font-bold tracking-tighter-custom text-lg">
											{item.method}
										</h3>
										<p className="text-sm text-kuralis-600">{item.cycle}</p>
									</div>
									{item.history.length > 0 && item.nextDate && (
										<div
											className={`px-3 py-2 rounded-sm text-sm ${
												item.nextDate < new Date()
													? "bg-accent-50 text-accent-500"
													: "bg-kuralis-50 text-kuralis-600"
											}`}
										>
											<div className="font-bold tracking-tighter-custom">
												次回予定日
											</div>
											<div className="mt-1">
												{format(item.nextDate, "yyyy/MM/dd")}
											</div>
										</div>
									)}
								</div>

								<div className="space-y-2 ml-8">
									{item.history.map((h) => (
										<div
											key={h.id}
											className="flex items-center justify-between group"
										>
											<div className="flex items-center space-x-2 text-sm text-kuralis-600">
												<FiCalendar size={14} />
												<span className="font-bold tracking-tighter-custom">
													{h.date}
												</span>
												<span className="text-kuralis-400">実施</span>
											</div>
											{user && (
												<button
													onClick={() =>
														handleDeleteHistory(item.id, h.id)
													}
													className="opacity-0 group-hover:opacity-100 text-kuralis-400 hover:text-accent-500 transition-all duration-300"
												>
													<FiTrash2 size={14} />
												</button>
											)}
										</div>
									))}

									{user &&
										(isAddingHistory === item.id ? (
											<div className="flex items-center space-x-2">
												<input
													type="date"
													value={newHistoryDate}
													onChange={(e) =>
														setNewHistoryDate(e.target.value)
													}
													className="text-sm border border-kuralis-200 rounded-sm px-2 py-1"
												/>
												<button
													onClick={() => handleAddHistory(item.id)}
													disabled={!newHistoryDate}
													className="text-sm text-kuralis-900 hover:text-kuralis-700 disabled:text-kuralis-400 transition-colors duration-300 font-bold tracking-tighter-custom"
												>
													追加
												</button>
												<button
													onClick={() => {
														setIsAddingHistory(null);
														setNewHistoryDate("");
													}}
													className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
												>
													キャンセル
												</button>
											</div>
										) : (
											<button
												onClick={() => setIsAddingHistory(item.id)}
												className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom inline-flex items-center"
											>
												<FiPlus size={14} className="mr-1" />
												<span>新しい履歴を追加</span>
											</button>
										))}
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
};

export default MaintenancePage;
