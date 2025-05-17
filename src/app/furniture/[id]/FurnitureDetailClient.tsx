"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sampleFurniture } from "@/data/sampleFurniture";
import FurnitureDetailImage from "./FurnitureDetailImage";
import FurnitureDetailTabs from "./FurnitureDetailTabs";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
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

interface Furniture {
	id: string;
	name: string;
	brand: string;
	category: string;
	location: string;
	imageUrl?: string;
	needsMaintenance: boolean;
	purchaseDate?: string;
	purchaseLocation?: string;
	maintenanceMethod?: string;
	notes?: string;
}

interface Props {
	initialFurniture: Furniture;
}

export default function FurnitureDetailClient({ initialFurniture }: Props) {
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAuth();

	const [isEditing, setIsEditing] = useState(false);
	const [furniture, setFurniture] = useState(initialFurniture);
	const [editedFurniture, setEditedFurniture] = useState<Furniture>(initialFurniture);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [needsMaintenance, setNeedsMaintenance] = useState(furniture.needsMaintenance);

	const handleDelete = () => {
		const index = sampleFurniture.findIndex((item) => item.id === furniture.id);
		if (index !== -1) {
			sampleFurniture.splice(index, 1);
			toast({
				title: "家具を削除しました",
				description: `${furniture.name} を削除しました。`,
			});
			router.push("/furniture");
		}
	};

	const handleSave = () => {
		const index = sampleFurniture.findIndex((item) => item.id === furniture.id);
		if (index !== -1) {
			const updated = {
				...editedFurniture,
				imageUrl: selectedImage
					? URL.createObjectURL(selectedImage)
					: editedFurniture.imageUrl,
				needsMaintenance,
			};
			sampleFurniture[index] = updated;
			setFurniture(updated);
			setIsEditing(false);
			setSelectedImage(null);
			toast({
				title: "変更を保存しました",
				description: `${updated.name} を更新しました。`,
			});
		}
	};

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
					imageUrl={furniture.imageUrl}
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
												この操作は取り消せません。本当に {furniture.name}{" "}
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
						furniture={furniture}
						editedFurniture={editedFurniture}
						setEditedFurniture={setEditedFurniture}
						isEditing={isEditing}
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
