"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useToast } from "@/hooks/useToast";
import { useFurnitureById } from "@/hooks/useFurnitureById";
import { useDeleteFurniture } from "@/hooks/useDeleteFurniture";
import { useUpdateFurniture } from "@/hooks/useUpdateFurniture";
import { useAuth } from "@/contexts/AuthContext";
import FurnitureDetailImage from "./FurnitureDetailImage";
import FurnitureDetailTabs from "./FurnitureDetailTabs";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import type { FurnitureWithExtras } from "@/types/furniture";
import type { Location } from "@/types/furniture_meta";
import type { MaintenanceSummary } from "@/types/maintenance";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

interface FurnitureDetailClientProps {
	initialFurniture: FurnitureWithExtras;
	initialLocations: Location[];
	initialMaintenanceSummary: MaintenanceSummary | null;
}

export default function FurnitureDetailClient({
	initialFurniture,
	initialLocations,
	initialMaintenanceSummary,
}: FurnitureDetailClientProps) {
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAuth();

	const { furniture, mutate, isLoading, error } = useFurnitureById(
		initialFurniture.id,
		initialFurniture
	);
	const { updateFurniture } = useUpdateFurniture(initialFurniture.id);
	const { deleteFurniture } = useDeleteFurniture(initialFurniture.id);

	const [isEditing, setIsEditing] = useState(false);
	const [editedFurniture, setEditedFurniture] = useState<FurnitureWithExtras>(initialFurniture);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const furnitureToUse = isEditing ? editedFurniture : (furniture ?? initialFurniture);

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
		} catch (error: unknown) {
			console.error("家具削除エラー:", error);
			toast({
				title: "家具の削除に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
		}
	};

	const handleSave = async () => {
		try {
			const formData = new FormData();
			formData.append("name", editedFurniture.name);
			formData.append("brand", editedFurniture.brand ?? "");
			formData.append("location_id", String(editedFurniture.location_id));
			formData.append("purchased_from", editedFurniture.purchased_from ?? "");
			formData.append("notes", editedFurniture.notes ?? "");

			// 購入日（Date → YYYY-MM-DD）
			if (editedFurniture.purchased_at) {
				formData.append(
					"purchased_at",
					new Date(editedFurniture.purchased_at).toISOString().split("T")[0] // フォーマット例: 2024-05-28
				);
			}

			// 画像
			if (selectedImage) {
				formData.append("image", selectedImage);
			}

			const result = await updateFurniture(formData);
			mutate(result, false);

			setIsEditing(false);
			setSelectedImage(null);

			toast({
				title: "変更を保存しました",
				description: `${result.name} を更新しました。`,
			});
		} catch (error: unknown) {
			console.error("家具更新エラー:", error);
			toast({
				title: "家具の更新に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
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

			{isLoading ? (
				// ローディング中のSkeleton表示
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* 左カラム：画像部分 */}
					<div className="w-full max-w-[500px] aspect-[4/3] bg-kuralis-100 rounded-sm animate-pulse" />

					{/* 右カラム：タブなどの情報部分のSkeleton */}
					<div className="space-y-6">
						{/* メンテナンスバッジ or スイッチのSkeleton */}
						<div className="flex justify-between items-center">
							<div className="h-6 w-48 bg-kuralis-100 rounded-sm animate-pulse" />
							<div className="h-6 w-12 bg-kuralis-100 rounded-sm animate-pulse" />
						</div>

						{/* タブ部分 Skeleton */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<div className="h-4 w-32 bg-kuralis-100 rounded-sm animate-pulse" />
								<div className="h-4 w-32 bg-kuralis-100 rounded-sm animate-pulse" />
								<div className="h-4 w-32 bg-kuralis-100 rounded-sm animate-pulse" />
							</div>
							<div className="h-32 w-full bg-kuralis-100 rounded-sm animate-pulse" />
							<div className="h-24 w-full bg-kuralis-100 rounded-sm animate-pulse" />
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[70vw] mx-auto">
					<FurnitureDetailImage
						isEditing={isEditing}
						imageUrl={furnitureToUse.image_url}
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
					/>

					<div className="space-y-8">
						{/* 編集削除ボタンをタブの外に表示 */}
						<div className="flex items-center justify-between">
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
							summary={initialMaintenanceSummary}
						/>

						{isEditing && (
							<div className="flex justify-end space-x-4 pt-8">
								<button
									onClick={() => {
										setIsEditing(false);
										setSelectedImage(null);
									}}
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
			)}
		</div>
	);
}
