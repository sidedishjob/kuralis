"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./buttonVariants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface LoadingButtonProps
	extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
	loadingText?: string;
	forceMinWidth?: boolean;
	asChild?: boolean;
}

export function LoadingButton({
	isLoading = false,
	loadingText = "処理中...",
	forceMinWidth = true,
	children,
	className,
	variant,
	size,
	disabled,
	...props
}: LoadingButtonProps) {
	const { isGuestUser } = useAuth();

	const isActuallyDisabled = isLoading || disabled || isGuestUser;
	const tooltipMessage = isGuestUser ? "ゲストユーザーのため操作できません" : "";

	const button = (
		<Button
			disabled={isActuallyDisabled}
			variant={variant}
			size={size}
			className={cn(className)}
			{...props}
		>
			{/* 表示を切り替えるが、ボタン内の幅を固定する */}
			<span
				className={cn(
					"flex items-center justify-center",
					forceMinWidth !== false && "min-w-[6em]"
				)}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 size-4 animate-spin" />
						{loadingText}
					</>
				) : (
					children
				)}
			</span>
		</Button>
	);

	return isGuestUser ? (
		<Tooltip>
			<TooltipTrigger asChild>
				<span>{button}</span>
			</TooltipTrigger>
			<TooltipContent>{tooltipMessage}</TooltipContent>
		</Tooltip>
	) : (
		button
	);
}
