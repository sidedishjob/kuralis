"use client";

import { FiUpload } from "react-icons/fi";
import DemoView from "@/components/DemoView";
import Image from "next/image";

interface Props {
	isEditing: boolean;
	imageUrl?: string;
	selectedImage: File | null;
	setSelectedImage: (file: File | null) => void;
}

export default function FurnitureDetailImage({
	isEditing,
	imageUrl,
	selectedImage,
	setSelectedImage,
}: Props) {
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

	return (
		<div className="sticky top-6">
			<DemoView>
				<div className="bg-kuralis-100 w-full aspect-square overflow-hidden shadow-lg relative group">
					{selectedImage ? (
						<img
							src={URL.createObjectURL(selectedImage)}
							alt="プレビュー画像"
							className="w-full h-full object-cover object-center transition-transform duration-700 ease-natural group-hover:scale-105"
						/>
					) : imageUrl ? (
						<div className="relative w-full h-full">
							<Image
								src={imageUrl}
								alt="家具画像"
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
							onClick={() => document.getElementById("furniture-image")?.click()}
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
								クリックまたはドラッグ＆ドロップで写真をアップロード
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
	);
}
