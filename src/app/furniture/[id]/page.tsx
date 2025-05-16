"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	FiArrowLeft,
	FiCalendar,
	FiMapPin,
	FiTool,
	FiAlertCircle,
	FiEdit2,
	FiTrash2,
	FiUpload,
	FiLock,
	FiList,
	FiInfo,
	FiShoppingBag,
	FiSettings,
	FiMoreVertical,
} from "react-icons/fi";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DemoView from "@/components/DemoView";
import { sampleFurniture } from "@/data/sampleFurniture";

export default function FurnitureDetailPage() {
	const params = useParams();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAuth();
	const [isSheetOpen, setIsSheetOpen] = React.useState(false);
	const [furniture, setFurniture] = React.useState(
		sampleFurniture.find((item) => item.id === id)
	);
	const [isEditing, setIsEditing] = React.useState(false);
	const [editedFurniture, setEditedFurniture] = React.useState(furniture);
	const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
	const [needsMaintenance, setNeedsMaintenance] = React.useState(
		furniture?.needsMaintenance || false
	);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		if (file && file.type.startsWith("image/")) {
			setSelectedImage(file);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setSelectedImage(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDelete = () => {
		const index = sampleFurniture.findIndex((item) => item.id === id);
		if (index !== -1) {
			sampleFurniture.splice(index, 1);
			toast({
				title: "Furniture Deleted",
				description: `${furniture?.name} has been removed from your collection.`,
			});
			router.push("/furniture");
		}
	};

	const handleSave = () => {
		if (!editedFurniture) return;

		const index = sampleFurniture.findIndex((item) => item.id === id);
		if (index !== -1) {
			const updatedFurniture = {
				...editedFurniture,
				imageUrl: selectedImage
					? URL.createObjectURL(selectedImage)
					: editedFurniture.imageUrl,
				needsMaintenance: needsMaintenance,
			};
			sampleFurniture[index] = updatedFurniture;
			setFurniture(updatedFurniture);
			setIsEditing(false);
			setSelectedImage(null);
			toast({
				title: "Changes Saved",
				description: `${editedFurniture.name} has been updated.`,
			});
		}
	};

	if (!furniture) {
		return (
			<div className="container mx-auto py-16 px-6 md:px-12 text-center">
				<p>Furniture not found.</p>
				<Link
					href="/furniture"
					className="text-kuralis-600 hover:text-kuralis-900 mt-4 inline-block"
				>
					Return to Collection
				</Link>
			</div>
		);
	}

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
				<div className="sticky top-6">
					<DemoView>
						<div className="bg-kuralis-100 w-full aspect-square overflow-hidden shadow-lg relative group">
							{selectedImage ? (
								<img
									src={URL.createObjectURL(selectedImage)}
									alt="Preview"
									className="w-full h-full object-cover object-center transition-transform duration-700 ease-natural group-hover:scale-105"
								/>
							) : furniture.imageUrl ? (
								<div className="relative w-full h-full">
									<Image
										src={furniture.imageUrl}
										alt={furniture.name}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover object-center transition-transform duration-700 ease-natural group-hover:scale-105"
									/>
								</div>
							) : isEditing ? (
								<div
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									className="w-full h-full flex flex-col items-center justify-center text-kuralis-400 cursor-pointer group"
									onClick={() =>
										document.getElementById("furniture-image")?.click()
									}
								>
									<input
										type="file"
										id="furniture-image"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
									<FiUpload
										size={32}
										className="mb-4 group-hover:scale-110 transition-transform duration-300"
									/>
									<p className="text-sm text-kuralis-600 font-bold tracking-tighter-custom text-center px-6">
										Click or drag & drop to upload a photo
									</p>
								</div>
							) : (
								<div className="w-full h-full flex flex-col items-center justify-center text-kuralis-400">
									<FiUpload size={32} className="mb-2" />
									<p className="text-sm">No image</p>
								</div>
							)}
						</div>
					</DemoView>
				</div>

				<div className="space-y-8">
					<div className="flex items-center justify-between mb-8">
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
						{user && (
							<>
								{/* Desktop actions */}
								<div className="hidden md:flex items-center space-x-3">
									<button
										onClick={() => {
											setIsEditing(true);
											setEditedFurniture(furniture);
										}}
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
													この操作は取り消せません。本当に{furniture.name}
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
								{/* Mobile actions */}
								<div className="md:hidden">
									<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
										<SheetTrigger asChild>
											<button className="p-2 text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 rounded-full hover:bg-kuralis-50">
												<FiMoreVertical size={18} />
											</button>
										</SheetTrigger>
										<SheetContent side="bottom" className="h-auto rounded-t-xl">
											<div className="py-4">
												<button
													onClick={() => {
														setIsSheetOpen(false);
														setIsEditing(true);
														setEditedFurniture(furniture);
													}}
													className="w-full flex items-center px-4 py-3 text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300"
												>
													<FiEdit2 size={18} className="mr-3" />
													<span className="font-bold tracking-tighter-custom">
														編集する
													</span>
												</button>
												<Dialog>
													<DialogTrigger asChild>
														<button className="w-full flex items-center px-4 py-3 text-accent-500 hover:text-accent-600 transition-colors duration-300">
															<FiTrash2 size={18} className="mr-3" />
															<span className="font-bold tracking-tighter-custom">
																削除する
															</span>
														</button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																家具を削除しますか？
															</DialogTitle>
															<DialogDescription>
																この操作は取り消せません。本当に
																{furniture.name}を削除しますか？
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
										</SheetContent>
									</Sheet>
								</div>
							</>
						)}
					</div>

					<Tabs defaultValue="basic" className="w-full">
						<TabsList className="w-full grid grid-cols-3 mb-8 bg-transparent p-0 gap-2">
							<TabsTrigger value="basic" className="flex items-center">
								<FiInfo className="mr-2" />
								基本情報
							</TabsTrigger>
							<TabsTrigger value="purchase" className="flex items-center">
								<FiShoppingBag className="mr-2" />
								購入情報
							</TabsTrigger>
							<TabsTrigger value="maintenance" className="flex items-center">
								<FiSettings className="mr-2" />
								メンテナンス
							</TabsTrigger>
						</TabsList>

						<TabsContent value="basic" className="space-y-8">
							<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300">
								<div className="flex justify-between items-start gap-4">
									<div className="min-w-0 flex-1">
										{isEditing ? (
											<div>
												<input
													type="text"
													value={editedFurniture?.name}
													onChange={(e) =>
														setEditedFurniture((prev) =>
															prev
																? { ...prev, name: e.target.value }
																: prev
														)
													}
													className="text-2xl md:text-3xl font-bold tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
												/>
												<input
													type="text"
													value={editedFurniture?.brand}
													onChange={(e) =>
														setEditedFurniture((prev) =>
															prev
																? { ...prev, brand: e.target.value }
																: prev
														)
													}
													className="text-kuralis-600 mt-2 text-sm font-bold tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none w-full"
												/>
											</div>
										) : (
											<div>
												<h1 className="text-2xl md:text-3xl font-bold tracking-tighter-custom">
													{furniture.name}
												</h1>
												<p className="text-kuralis-600 mt-2 text-sm font-bold tracking-tighter-custom truncate">
													{furniture.brand}
												</p>
											</div>
										)}
									</div>
									{!user && (
										<Link
											href="/signin"
											className="px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-colors duration-300 text-sm font-bold tracking-tighter-custom flex items-center space-x-2"
										>
											<FiLock size={16} />
											<span>サインインして編集</span>
										</Link>
									)}
								</div>
							</div>

							<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
								<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
									基本情報
								</h2>
								<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
									<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
										<FiMapPin size={16} className="mr-2" />
										<span>Category</span>
									</div>
									{isEditing ? (
										<input
											type="text"
											value={editedFurniture?.category}
											onChange={(e) =>
												setEditedFurniture((prev) =>
													prev
														? { ...prev, category: e.target.value }
														: prev
												)
											}
											className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
										/>
									) : (
										<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
											{furniture.category}
										</div>
									)}
								</div>

								<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
									<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
										<FiMapPin size={16} className="mr-2" />
										<span>Location</span>
									</div>
									{isEditing ? (
										<input
											type="text"
											value={editedFurniture?.location}
											onChange={(e) =>
												setEditedFurniture((prev) =>
													prev
														? { ...prev, location: e.target.value }
														: prev
												)
											}
											className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
										/>
									) : (
										<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
											{furniture.location}
										</div>
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="purchase" className="space-y-8">
							<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
								<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
									購入情報
								</h2>
								{(isEditing || furniture.purchaseDate) && (
									<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
										<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
											<FiCalendar size={16} className="mr-2" />
											<span>Purchase Date</span>
										</div>
										{isEditing ? (
											<input
												type="date"
												value={editedFurniture?.purchaseDate}
												onChange={(e) =>
													setEditedFurniture((prev) =>
														prev
															? {
																	...prev,
																	purchaseDate: e.target.value,
																}
															: prev
													)
												}
												className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
											/>
										) : (
											<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
												{furniture.purchaseDate &&
													new Date(
														furniture.purchaseDate
													).toLocaleDateString()}
											</div>
										)}
									</div>
								)}

								{(isEditing || furniture.purchaseLocation) && (
									<div className="flex items-center border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
										<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 flex items-center font-normal tracking-tighter-custom">
											<FiMapPin size={16} className="mr-2" />
											<span>Store</span>
										</div>
										{isEditing ? (
											<input
												type="text"
												value={editedFurniture?.purchaseLocation}
												onChange={(e) =>
													setEditedFurniture((prev) =>
														prev
															? {
																	...prev,
																	purchaseLocation:
																		e.target.value,
																}
															: prev
													)
												}
												className="font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
											/>
										) : (
											<div className="flex-1 min-w-0 font-normal tracking-tighter-custom truncate">
												{furniture.purchaseLocation}
											</div>
										)}
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent value="maintenance" className="space-y-8">
							<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
								<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
									メンテナンス情報
								</h2>
								{(isEditing || furniture.maintenanceMethod) && (
									<div className="flex border-b border-kuralis-100 pb-4 hover:bg-kuralis-50/50 transition-colors duration-300 -mx-8 px-8">
										<div className="w-24 md:w-36 flex-shrink-0 text-kuralis-600 font-normal tracking-tighter-custom">
											<FiTool size={16} className="mr-2 inline-block" />
											<span>メンテナンス</span>
										</div>
										{isEditing ? (
											<input
												type="text"
												value={editedFurniture?.maintenanceMethod}
												onChange={(e) =>
													setEditedFurniture((prev) =>
														prev
															? {
																	...prev,
																	maintenanceMethod:
																		e.target.value,
																}
															: prev
													)
												}
												className="flex-1 min-w-0 font-normal tracking-tighter-custom bg-transparent border-b border-kuralis-200 focus:border-kuralis-900 outline-none"
											/>
										) : (
											<div className="space-y-2">
												<div className="font-normal tracking-tighter-custom break-words">
													{furniture.maintenanceMethod}
												</div>
												<Link
													href={`/furniture/${furniture.id}/maintenance`}
													className="inline-flex items-center px-4 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
												>
													<FiList size={14} className="mr-2" />
													<span>メンテナンス履歴を管理</span>
												</Link>
											</div>
										)}
									</div>
								)}

								{(isEditing || furniture.notes) && (
									<div className="bg-white p-8 border border-kuralis-100 shadow-sm hover:shadow-md transition-shadow duration-300">
										<h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
											備考
										</h2>
										{isEditing ? (
											<textarea
												value={editedFurniture?.notes}
												onChange={(e) =>
													setEditedFurniture((prev) =>
														prev
															? { ...prev, notes: e.target.value }
															: prev
													)
												}
												className="w-full p-4 font-normal tracking-tighter-custom bg-kuralis-50 rounded-sm border-none focus:ring-1 focus:ring-kuralis-900 outline-none resize-none"
												rows={3}
											/>
										) : (
											<div className="p-4 bg-kuralis-50 rounded-sm font-normal tracking-tighter-custom break-words">
												{furniture.notes}
											</div>
										)}
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>

					{isEditing && (
						<div className="flex justify-end space-x-4 pt-8">
							<button
								onClick={() => setIsEditing(false)}
								className="px-6 py-2 border border-kuralis-200 rounded-sm hover:bg-kuralis-50 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="px-6 py-2 bg-kuralis-900 text-white rounded-sm hover:bg-kuralis-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold tracking-tighter-custom"
							>
								Save
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
