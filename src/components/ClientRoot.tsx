"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<Layout>
				{children}
				<Toaster />
			</Layout>
		</AuthProvider>
	);
}
