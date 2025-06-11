import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MdContactSupport } from "react-icons/md";

export const SupportSection = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<MdContactSupport className="w-5 h-5 mr-1" />
					サポート
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col space-y-2">
				<Link
					href="/contact"
					className="underline text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary"
				>
					お問い合わせ
				</Link>
			</CardContent>
		</Card>
	);
};
