// components/TrackedLink.tsx
"use client";

import Link from "next/link";
import { event } from "@/lib/gtag";

type Props = {
	href: string;
	label: string;
	category?: string;
	children: React.ReactNode;
	className?: string;
};

const TrackedLink = ({ href, label, category = "CTA", children, className }: Props) => {
	const handleClick = () => {
		event({
			action: "click",
			category,
			label,
		});
	};

	return (
		<Link href={href} onClick={handleClick} className={className}>
			{children}
		</Link>
	);
};

export default TrackedLink;
