"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import { useSupabaseClient } from "@/lib/supabase/hooks/useSupabaseClient";
import { FurnitureEditSchema } from "@/lib/validation";
import { DemoView } from "@/components/common/DemoView";

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
	const {
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useFormContext<FurnitureEditSchema>();

	const [publicUrl, setPublicUrl] = useState<string | null>(null);
	const supabase = useSupabaseClient();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Supabaseの imageUrl をもとに表示用の public URL を設定する副作用
	// 1. imageUrl がすでに完全なURLならそのまま使う
	// 2. Supabase Storage のパス形式なら getPublicUrl() で変換してから使う
	useEffect(() => {
		if (!imageUrl) {
			setPublicUrl(null);
			return;
		}

		if (imageUrl) {
			if (imageUrl.startsWith("http")) {
				// すでに public URL の場合
				setPublicUrl(imageUrl);
			} else {
				// パスだけの場合は Supabase 側で公開URLを取得
				const { publicUrl } = supabase.storage
					.from("furniture")
					.getPublicUrl(imageUrl).data;
				setPublicUrl(publicUrl || null);
			}
		}
	}, [imageUrl, supabase]);

	// ファイルが画像の場合に selectedImage に設定するヘルパー関数
	const handleFileSelect = (file: File | null) => {
		if (!file) {
			setValue("image", null);
			setSelectedImage(null);
			clearErrors("image");
			return;
		}

		// zodで使ったルールに従って手動チェック
		const isValidType = ["image/jpeg", "image/png"].includes(file.type);
		const isValidSize = file.size <= 10 * 1024 * 1024;

		if (!isValidType) {
			setError("image", {
				type: "manual",
				message: "JPEGまたはPNG画像のみアップロード可能です",
			});
			setValue("image", null);
			setSelectedImage(null);
			return;
		}

		if (!isValidSize) {
			setError("image", {
				type: "manual",
				message: "画像サイズは10MB以内にしてください",
			});
			setValue("image", null);
			setSelectedImage(null);
			return;
		}

		clearErrors("image");
		setValue("image", file);
		setSelectedImage(file);
	};

	// 選択された画像ファイルを selectedImage に設定
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		handleFileSelect(event.target.files?.[0] || null);
	};

	// ドロップされた画像ファイルを selectedImage に設定
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		handleFileSelect(event.dataTransfer.files?.[0] || null);
	};

	// ドラッグ中のブラウザデフォルト動作を抑制（ファイル表示や開かれるのを防ぐ）
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const renderImage = () => {
		if (selectedImage) {
			// プレビュー表示（新規選択時）
			return (
				<Image
					src={URL.createObjectURL(selectedImage)}
					alt="プレビュー画像"
					width={400}
					height={300}
					className="w-full h-full object-cover transition-transform duration-700 ease-natural group-hover:scale-105"
					unoptimized
				/>
			);
		} else if (publicUrl) {
			// 既存画像（変更不可）
			return (
				<div className="relative w-full h-full">
					<Image
						src={publicUrl}
						alt="家具画像"
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
						className="w-full h-full object-cover transition-transform duration-700 ease-natural group-hover:scale-105"
					/>
				</div>
			);
		} else if (isEditing) {
			// 画像がなく、編集モード → アップロードUI
			return (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onClick={() => fileInputRef.current?.click()}
					className="w-full h-full flex flex-col items-center justify-center text-kuralis-400 cursor-pointer group"
				>
					<input
						ref={fileInputRef}
						type="file"
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
			);
		} else {
			// 画像なし・編集不可
			return (
				<div className="w-full h-full flex flex-col items-center justify-center text-kuralis-400">
					<FiUpload size={32} className="mb-2" />
					<p className="text-sm">No image</p>
				</div>
			);
		}
	};

	return (
		<div className="sticky top-6">
			<DemoView>
				<div className="bg-kuralis-100 w-full aspect-square overflow-hidden shadow-lg relative group">
					{renderImage()}
				</div>
				{errors.image && typeof errors.image.message === "string" && (
					<p className="mt-2 text-red-500 text-sm font-bold tracking-tighter-custom">
						{errors.image.message}
					</p>
				)}
			</DemoView>
		</div>
	);
}
