import React from "react";

interface Props {
	children: React.ReactNode;
}

export const SettingsPageLayout: React.FC<Props> = ({ children }) => {
	return (
		<div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
			<h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">設定</h1>
			<div className="space-y-4">{children}</div>
		</div>
	);
};
