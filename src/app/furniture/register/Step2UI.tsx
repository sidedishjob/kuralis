"use client";

import { FiUpload, FiX } from "react-icons/fi";
import { Category, Location } from "@/types/furniture_meta";

interface Props {
	formData: {
		category: Category | null;
		location: Location | null;
		name: string;
		image: File | null;
	};
	setFormData: React.Dispatch<
		React.SetStateAction<{
			category: Category | null;
			location: Location | null;
			name: string;
			image: File | null;
		}>
	>;
	onSubmit: () => void;
}
export default function Step2UI({ formData, setFormData, onSubmit }: Props) {
	const isValid = formData.name.trim().length > 0;

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		if (file && file.type.startsWith("image/")) {
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	return (
		<div className="space-y-4 md:space-y-8">
			<h1 className="text-xl md:text-3xl font-bold tracking-tighter-custom text-center mb-6 text-kuralis-900">
				家具の名前と写真を入力してください
			</h1>

			{/* Summary */}
			<div className="flex items-center space-x-4 mb-8 text-xs">
				<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm font-bold tracking-tighter-custom">
					{formData.category?.name}
				</div>
				<div className="px-2 py-1 bg-kuralis-100 text-kuralis-600 rounded-sm font-bold tracking-tighter-custom">
					{formData.location?.name}
				</div>
			</div>

			{/* Name Input */}
			<div>
				<label className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4 block">
					家具名
				</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
					className="w-full px-6 py-4 border border-kuralis-200 rounded-sm focus:border-kuralis-900 outline-none transition-all duration-500 font-bold tracking-tighter-custom bg-white/80 backdrop-blur-sm focus:bg-white"
					placeholder="例：ウォールナットダイニングテーブル"
				/>
			</div>

			{/* Image Upload */}
			<div>
				<label className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4 block">
					写真
				</label>
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					className="border-2 border-dashed border-kuralis-200 rounded-sm p-6 text-center hover:border-kuralis-400 transition-all duration-500 bg-white/80 backdrop-blur-sm group"
				>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						id="furniture-image"
					/>
					{formData.image ? (
						<div className="space-y-2">
							<div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-kuralis-50">
								<img
									src={URL.createObjectURL(formData.image)}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
								<button
									onClick={(e) => {
										e.preventDefault();
										setFormData((prev) => ({ ...prev, image: null }));
									}}
									className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300"
								>
									<FiX size={16} className="text-kuralis-900" />
								</button>
							</div>
							<div className="text-sm text-kuralis-900 font-bold tracking-tighter-custom">
								{formData.image.name}
							</div>
							<button
								onClick={(e) => {
									e.preventDefault();
									document.getElementById("furniture-image")?.click();
								}}
								className="text-sm text-kuralis-600 hover:text-kuralis-900 transition-colors duration-300 font-bold tracking-tighter-custom"
							>
								写真を変更
							</button>
						</div>
					) : (
						<label
							htmlFor="furniture-image"
							className="cursor-pointer space-y-2 w-full aspect-[4/3] flex flex-col items-center justify-center bg-kuralis-50/50"
						>
							<FiUpload
								size={32}
								className="mx-auto text-kuralis-400 group-hover:scale-110 transition-transform duration-500"
							/>
							<div className="text-sm text-kuralis-600 font-bold tracking-tighter-custom">
								クリックまたはドラッグ＆ドロップで写真をアップロード
							</div>
						</label>
					)}
				</div>
			</div>

			<div className="pt-8">
				<button
					onClick={onSubmit}
					disabled={!isValid}
					className={`w-full py-3 px-4 rounded-sm font-bold tracking-tighter-custom text-sm transition-all duration-300 ${
						isValid
							? "bg-kuralis-900 text-white hover:bg-kuralis-800 transform hover:-translate-y-1"
							: "bg-kuralis-200 text-kuralis-400 cursor-not-allowed"
					}`}
				>
					登録する
				</button>
			</div>
		</div>
	);
}
