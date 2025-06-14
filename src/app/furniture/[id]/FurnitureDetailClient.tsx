"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useFurnitureById } from "@/hooks/useFurnitureById";
import { useDeleteFurniture } from "@/hooks/useDeleteFurniture";
import { useUpdateFurniture } from "@/hooks/useUpdateFurniture";
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
import { furnitureEditSchema, type FurnitureEditSchema } from "@/lib/validation";

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
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const methods = useForm<FurnitureEditSchema>({
		resolver: zodResolver(furnitureEditSchema),
		defaultValues: {
			name: initialFurniture.name,
			brand: initialFurniture.brand || "",
			location_id: initialFurniture.location_id,
			purchased_at: initialFurniture.purchased_at || "",
			purchased_from: initialFurniture.purchased_from || "",
			notes: initialFurniture.notes || "",
		},
	});

	const furnitureToUse = furniture ?? initialFurniture;

	useEffect(() => {
		if (furniture && !isEditing) {
			methods.reset({
				name: furniture.name,
				brand: furniture.brand || "",
				location_id: furniture.location_id,
				purchased_at: furniture.purchased_at || "",
				purchased_from: furniture.purchased_from || "",
				notes: furniture.notes || "",
			});
		}
	}, [furniture, isEditing, methods]);

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

	const onSubmit = async (data: FurnitureEditSchema) => {
		try {
			const formData = new FormData();
			formData.append("name", data.name ?? "");
			formData.append("brand", data.brand ?? "");
			formData.append("location_id", String(data.location_id ?? ""));
			formData.append("purchased_from", data.purchased_from ?? "");
			formData.append("notes", data.notes ?? "");

			if (data.purchased_at) {
				formData.append("purchased_at", data.purchased_at);
			} else {
				formData.append("purchased_at", "");
			}

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
		<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
			<div className="container mx-auto py-12 px-6 md:px-12">
				{/* ヘッダー */}
				<div className="flex items-center justify-between mb-12">
					<Link
						href="/furniture"
						className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors duration-300 group"
					>
						<FiArrowLeft
							size={20}
							className="mr-2 transform translate-x-0 group-hover:-translate-x-1 transition-all duration-400 ease-natural"
						/>
						<span className="text-sm font-medium">コレクションに戻る</span>
					</Link>

					{user && !isEditing && (
						<div className="flex items-center space-x-3">
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="inline-flex items-center px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-50 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
							>
								<FiEdit2 size={18} className="mr-2" />
								<span className="text-sm font-medium">編集</span>
							</button>

							<Dialog>
								<DialogTrigger asChild>
									<button
										type="button"
										className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 rounded-lg"
									>
										<FiTrash2 size={18} className="mr-2" />
										<span className="text-sm font-medium">削除</span>
									</button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle className="text-xl font-medium">
											家具を削除しますか？
										</DialogTitle>
										<DialogDescription className="mt-2 text-neutral-600">
											この操作は取り消せません。本当に
											<span className="font-medium text-neutral-900">
												{furnitureToUse.name}
											</span>
											を削除しますか？
										</DialogDescription>
									</DialogHeader>
									<DialogFooter className="mt-6">
										<button
											type="button"
											onClick={handleDelete}
											className="w-full px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 rounded-lg text-sm font-medium"
										>
											削除する
										</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>

				{isLoading ? (
					// ローディング中のSkeleton表示
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						<div className="w-full max-w-[500px] aspect-[4/3] bg-neutral-100 rounded-xl animate-pulse" />
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="h-8 w-48 bg-neutral-100 rounded-lg animate-pulse" />
								<div className="h-8 w-12 bg-neutral-100 rounded-lg animate-pulse" />
							</div>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div className="h-4 w-32 bg-neutral-100 rounded-lg animate-pulse" />
									<div className="h-4 w-32 bg-neutral-100 rounded-lg animate-pulse" />
									<div className="h-4 w-32 bg-neutral-100 rounded-lg animate-pulse" />
								</div>
								<div className="h-32 w-full bg-neutral-100 rounded-lg animate-pulse" />
								<div className="h-24 w-full bg-neutral-100 rounded-lg animate-pulse" />
							</div>
						</div>
					</div>
				) : (
					<FormProvider {...methods}>
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
								{/* 左カラム：画像 */}
								<div className="space-y-6">
									<FurnitureDetailImage
										isEditing={isEditing}
										imageUrl={furnitureToUse.image_url}
										selectedImage={selectedImage}
										setSelectedImage={setSelectedImage}
									/>
								</div>

								{/* 右カラム：情報 */}
								<div className="space-y-8">
									{isEditing && (
										<div className="flex items-center justify-end space-x-3">
											<button
												type="button"
												onClick={() => setIsEditing(false)}
												className="inline-flex items-center px-4 py-2 bg-white text-neutral-600 hover:bg-neutral-50 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
											>
												<FiX size={18} className="mr-2" />
												<span className="text-sm font-medium">
													キャンセル
												</span>
											</button>
											<button
												type="submit"
												className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
											>
												<FiSave size={18} className="mr-2" />
												<span className="text-sm font-medium">保存</span>
											</button>
										</div>
									)}

									<FurnitureDetailTabs
										furniture={furnitureToUse}
										isEditing={isEditing}
										locations={initialLocations}
										summary={initialMaintenanceSummary}
									/>
								</div>
							</div>
						</form>
					</FormProvider>
				)}
			</div>
		</div>
	);
}
