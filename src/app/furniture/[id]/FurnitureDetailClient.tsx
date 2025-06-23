"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/useToast";
import { useFurnitureById } from "@/hooks/useFurnitureById";
import { useDeleteFurniture } from "@/hooks/useDeleteFurniture";
import { useUpdateFurniture } from "@/hooks/useUpdateFurniture";
import FurnitureDetailImage from "./FurnitureDetailImage";
import FurnitureDetailTabs from "./FurnitureDetailTabs";
import { ErrorMessage } from "@/components/common/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loadingButton";
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

	const { furniture, mutate, isLoading, error } = useFurnitureById(
		initialFurniture.id,
		initialFurniture
	);
	const { updateFurniture } = useUpdateFurniture(initialFurniture.id);
	const { deleteFurniture } = useDeleteFurniture(initialFurniture.id);

	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
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
			// 編集モードを抜けたときに最新のデータでリセット
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
		setIsDeleting(true);
		try {
			await deleteFurniture();

			toast({
				title: "家具を削除しました",
				description: `${furniture?.name} を削除しました。`,
			});
			router.push("/furniture");
			router.refresh();
		} catch (error: unknown) {
			console.error("家具削除エラー:", error);
			toast({
				title: "家具の削除に失敗しました",
				description: getErrorMessage(error, "もう一度お試しください"),
				variant: "destructive",
			});
			setIsDeleting(false);
		}
	};

	const onSubmit = async (data: FurnitureEditSchema) => {
		setIsSaving(true);
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
		} finally {
			setIsSaving(false);
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

	if (!furnitureToUse) return <div>家具データが見つかりません</div>;

	return (
		<div className="container mx-auto py-6 md:py-12 px-6 md:px-12">
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
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[90vw] mx-auto">
							<FurnitureDetailImage
								isEditing={isEditing}
								imageUrl={furnitureToUse.image_url}
								selectedImage={selectedImage}
								setSelectedImage={setSelectedImage}
							/>

							<div className="space-y-8">
								<FurnitureDetailTabs
									furniture={furnitureToUse}
									isEditing={isEditing}
									locations={initialLocations}
									summary={initialMaintenanceSummary}
								/>

								{/* 編集削除ボタンをタブの外に表示 */}
								<div className="flex items-center justify-between">
									{!isEditing ? (
										<div className="flex justify-end space-x-4">
											<button
												type="button"
												onClick={() => setIsEditing(true)}
												className="h-10 p-2 text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 rounded-full hover:bg-kuralis-50"
											>
												<FiEdit2 size={18} />
											</button>
											<Dialog>
												<DialogTrigger asChild>
													<button
														type="button"
														className="p-2 text-accent-500 hover:text-accent-600 transition-colors duration-300 rounded-full hover:bg-accent-50"
													>
														<FiTrash2 size={18} />
													</button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>
															家具を削除しますか？
														</DialogTitle>
														<DialogDescription>
															この操作は取り消せません。本当に
															{furnitureToUse.name}
															を削除しますか？
														</DialogDescription>
													</DialogHeader>
													<DialogFooter className="mt-4">
														<LoadingButton
															type="button"
															variant="destructive"
															isLoading={isDeleting}
															loadingText="削除中..."
															onClick={handleDelete}
														>
															削除する
														</LoadingButton>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</div>
									) : (
										<div className="flex justify-end space-x-4">
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													setIsEditing(false);
													setSelectedImage(null);
													methods.reset();
												}}
												className="h-10 px-6 transition-all duration-300 transform hover:-translate-y-0.5 tracking-tighter-custom"
											>
												キャンセル
											</Button>
											<LoadingButton
												type="submit"
												isLoading={isSaving}
												loadingText="保存中..."
												className="px-6 tracking-tighter-custom transition-all duration-300 transform hover:-translate-y-0.5"
											>
												保存する
											</LoadingButton>
										</div>
									)}
								</div>
							</div>
						</div>
					</form>
				</FormProvider>
			)}
		</div>
	);
}
