"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFurnitureById } from "@/hooks/useFurnitureById";
import FurnitureDetailImage from "./FurnitureDetailImage";
import FurnitureDetailTabs from "./FurnitureDetailTabs";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import type { FurnitureWithExtras } from "@/types/furniture_new";
import type { Location } from "@/types/furniture_meta";

interface FurnitureDetailClientProps {
	initialFurniture: FurnitureWithExtras;
	initialLocations: Location[];
}

export default function FurnitureDetailClient({
	initialFurniture,
	initialLocations,
}: FurnitureDetailClientProps) {
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAuth();

	const { furniture, updateFurniture, deleteFurniture, mutate, isLoading, error } =
		useFurnitureById(initialFurniture.id, initialFurniture);

	const [isEditing, setIsEditing] = useState(false);
	const [editedFurniture, setEditedFurniture] = useState<FurnitureWithExtras>(initialFurniture);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	// TODO:メンテナンス情報取得処理追加
	const [needsMaintenance, setNeedsMaintenance] = useState(true);

	const furnitureToUse = furniture ?? initialFurniture;

	useEffect(() => {
		if (furniture && !isEditing) {
			setEditedFurniture(furniture);
		}
	}, [furniture, isEditing]);

	const handleDelete = async () => {
		try {
			await deleteFurniture();
			router.push("/furniture");
			toast({
				title: "家具を削除しました",
				description: `${furniture?.name} を削除しました。`,
			});
		} catch (err) {
			toast({
				title: "削除に失敗しました",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		}
	};

	const handleSave = async () => {
		try {
			const updated = {
				...editedFurniture,
				needsMaintenance,
			};
			const result = await updateFurniture(updated);
			setIsEditing(false);
			setSelectedImage(null);
			toast({
				title: "変更を保存しました",
				description: `${result.name} を更新しました。`,
			});
		} catch (err) {
			toast({
				title: "更新に失敗しました",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		}
	};

	if (isLoading && !furniture) return <div>読み込み中...</div>;
	if (error) return <div>エラーが発生しました</div>;
	if (!furnitureToUse) return <div>家具データが見つかりません</div>;

	return (
		<div className="container mx-auto py-12 px-6 md:px-12">
			<Link
				href="/furniture"
				className="inline-flex items-center text-kuralis-600 hover:text-kuralis-900 mb-8 transition-colors duration-300 group font-normal tracking-tighter-custom"
			>
				<FiArrowLeft
					size={16}
					className="mr-2 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-400 ease-natural"
				/>
				<span>Back to Collection</span>
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<FurnitureDetailImage
					isEditing={isEditing}
					imageUrl={furnitureToUse.image_url}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
				/>

				<div className="space-y-8">
					{/* バッジ・編集削除ボタンをタブの外に表示 */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							{!isEditing && needsMaintenance && (
								<div className="px-3 py-1.5 bg-accent-50 text-accent-500 rounded-full text-sm font-bold tracking-tighter-custom flex items-center shadow-sm hover:shadow-md transition-all duration-300">
									<FiAlertCircle size={14} className="mr-1.5" />
									<span>メンテナンスが必要です</span>
								</div>
							)}
							{isEditing && (
								<div className="flex items-center space-x-2">
									<Switch
										checked={needsMaintenance}
										onCheckedChange={setNeedsMaintenance}
										className="data-[state=checked]:bg-accent-500"
									/>
									<span className="text-sm font-bold tracking-tighter-custom text-kuralis-600">
										メンテナンスが必要
									</span>
								</div>
							)}
						</div>

						{user && !isEditing && (
							<div className="flex items-center space-x-3">
								<button
									onClick={() => setIsEditing(true)}
									className="p-2 text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 rounded-full hover:bg-kuralis-50"
								>
									<FiEdit2 size={18} />
								</button>
								<Dialog>
									<DialogTrigger asChild>
										<button className="p-2 text-accent-500 hover:text-accent-600 transition-colors duration-300 rounded-full hover:bg-accent-50">
											<FiTrash2 size={18} />
										</button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>家具を削除しますか？</DialogTitle>
											<DialogDescription>
												この操作は取り消せません。本当に
												{furnitureToUse.name}
												を削除しますか？
											</DialogDescription>
										</DialogHeader>
										<DialogFooter className="mt-4">
											<button
												onClick={handleDelete}
												className="px-4 py-2 bg-accent-500 text-white rounded-sm hover:bg-accent-400 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
											>
												削除する
											</button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						)}
					</div>

					<FurnitureDetailTabs
						furniture={furnitureToUse}
						editedFurniture={editedFurniture}
						setEditedFurniture={setEditedFurniture}
						isEditing={isEditing}
						locations={initialLocations}
					/>

					{isEditing && (
						<div className="flex justify-end space-x-4 pt-8">
							<button
								onClick={() => setIsEditing(false)}
								className="px-6 py-2 border border-kuralis-200 rounded-sm hover:bg-kuralis-50 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
							>
								キャンセル
							</button>
							<button
								onClick={handleSave}
								className="px-6 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
							>
								保存する
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
