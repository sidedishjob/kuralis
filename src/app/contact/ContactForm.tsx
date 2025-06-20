"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loadingButton";
import type { ContactSchema } from "@/lib/validation";

type Props = {
	onSubmit: (data: ContactSchema) => void;
	isSuccess: boolean;
};

export function ContactForm({ onSubmit, isSuccess }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useFormContext<ContactSchema>();

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div>
				<label htmlFor="name" className="block text-sm font-medium">
					お名前
				</label>
				<Input id="name" {...register("name")} placeholder="山田 太郎" />
				{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
			</div>

			<div>
				<label htmlFor="email" className="block text-sm font-medium">
					メールアドレス
				</label>
				<Input
					id="email"
					type="email"
					{...register("email")}
					placeholder="example@example.com"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="subject" className="block text-sm font-medium">
					件名
				</label>
				<Input id="subject" {...register("subject")} placeholder="お問い合わせの件名" />
				{errors.subject && (
					<p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="message" className="block text-sm font-medium">
					メッセージ
				</label>
				<Textarea
					id="message"
					{...register("message")}
					placeholder="お問い合わせ内容をご記入ください"
					className="min-h-[200px]"
				/>
				{errors.message && (
					<p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
				)}
			</div>

			<LoadingButton
				type="submit"
				isLoading={isSubmitting || isSuccess}
				loadingText="送信中..."
				className="w-full"
			>
				送信する
			</LoadingButton>
		</form>
	);
}
