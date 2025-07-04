"use client";

import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import type {
	UseFormRegister,
	FieldErrors,
	UseFormGetValues,
	UseFormSetValue,
} from "react-hook-form";
import { LoadingButton } from "@/components/ui/loadingButton";
import type { RegisterFurnitureSchema } from "@/lib/validation/furnitureSchema";
import type { Category, Location } from "@/types/furniture_meta";

interface Props {
	category: Category | null;
	location: Location | null;
	formRegister: UseFormRegister<RegisterFurnitureSchema>;
	getValues: UseFormGetValues<RegisterFurnitureSchema>;
	setValue: UseFormSetValue<RegisterFurnitureSchema>;
	errors: FieldErrors<RegisterFurnitureSchema>;
	onSubmit: () => void;
	isValid: boolean;
	isLoading: boolean;
}

export default function Step2UI({
	category,
	location,
	formRegister,
	getValues,
	setValue,
	errors,
	onSubmit,
	isValid,
	isLoading,
}: Props) {
	const image = getValues("image");

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		if (file && file.type.startsWith("image/")) {
			setValue("image", file, { shouldValidate: true, shouldDirty: true });
		}
		// ファイル入力をリセットして同じファイルでも再選択可能にする
		event.target.value = "";
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setValue("image", file, { shouldValidate: true, shouldDirty: true });
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.preventDefault();
		setValue("image", null, { shouldValidate: true, shouldDirty: true });
		// ファイル入力もリセット
		const fileInput = document.getElementById("furniture-image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	return (
		<div className="space-y-4 md:space-y-8">
			<h1 className="text-xl md:text-3xl font-bold tracking-tighter-custom text-center mb-6 text-kuralis-900">
				家具の名前と写真を入力してください
			</h1>

			{/* Summary */}
			<div className="flex items-center space-x-4 mb-8 text-xs">
				{category && (
					<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm tracking-tighter-custom">
						{category.name}
					</div>
				)}
				{location && (
					<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm tracking-tighter-custom">
						{location.name}
					</div>
				)}
			</div>

			{/* Name Input */}
			<div>
				<label className="text-sm tracking-tighter-custom text-kuralis-600 mb-4 block">
					家具名
				</label>
				<input
					type="text"
					placeholder="例：ウォールナットダイニングテーブル"
					className="w-full px-6 py-4 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none transition-all duration-500 tracking-tighter-custom bg-white/80 backdrop-blur-sm focus:bg-white"
					{...formRegister("name")}
				/>
				{errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
			</div>

			{/* Image Upload */}
			<div>
				<label className="text-sm tracking-tighter-custom text-kuralis-600 mb-4 block">
					写真
					<span className="ml-2 text-xs text-kuralis-500 bg-kuralis-100 rounded px-2 py-0.5">
						任意
					</span>
				</label>
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					className="border-2 border-dashed border-kuralis-200 rounded-sm p-6 text-center backdrop-blur-sm"
				>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						id="furniture-image"
					/>
					{image ? (
						<div className="space-y-2">
							<div className="relative aspect-[4/3] w-full">
								{image instanceof File && (
									<Image
										src={URL.createObjectURL(image)}
										alt="Preview"
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="w-full h-full object-cover"
										unoptimized
									/>
								)}
								<button
									onClick={handleRemoveImage}
									className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300"
								>
									<FiX size={16} className="text-kuralis-900" />
								</button>
							</div>
							<button
								onClick={(e) => {
									e.preventDefault();
									document.getElementById("furniture-image")?.click();
								}}
								className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 tracking-tighter-custom"
							>
								写真を変更
							</button>
						</div>
					) : (
						<label
							htmlFor="furniture-image"
							className="aspect-[4/3] w-full h-full flex flex-col items-center justify-center text-kuralis-400 cursor-pointer group"
						>
							<FiUpload
								size={32}
								className="mb-4 group-hover:scale-110 transition-transform duration-300"
							/>
							<div className="text-sm text-kuralis-600 tracking-tighter-custom">
								クリックまたはドラッグ＆ドロップで
								<br className="md:hidden" />
								写真をアップロード
							</div>
						</label>
					)}
				</div>
			</div>

			<div className="w-full pt-8">
				<LoadingButton
					onClick={onSubmit}
					isLoading={isLoading}
					disabled={!isValid}
					loadingText="登録中..."
					className={`w-full tracking-tighter-custom transition-all duration-300 ${
						isValid
							? "transform hover:-translate-y-0.5"
							: "bg-kuralis-200 text-kuralis-400 cursor-not-allowed"
					}`}
				>
					登録する
				</LoadingButton>
			</div>
		</div>
	);
}
