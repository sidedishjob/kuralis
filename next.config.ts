/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "vjrywcrqdwmywiojnxap.supabase.co",
				port: "",
				pathname: "/**", // ← Supabase Storage 用のパターン
			},
		],
	},
};

module.exports = nextConfig;
