"use client";

import React from "react";

interface DemoViewProps {
	children: React.ReactNode;
}

// DemoView は子要素をそのままラップするだけの装飾用ラッパーコンポーネントです。
const DemoView: React.FC<DemoViewProps> = ({ children }) => {
	return <div className="relative group">{children}</div>;
};

export default DemoView;
