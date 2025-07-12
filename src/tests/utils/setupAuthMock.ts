type MockUser = {
	email: string;
};

type AuthMockOptions = {
	user?: MockUser | null;
	loading?: boolean;
	isGuestUser?: boolean;
	logout?: () => Promise<void>;
};

export const mockAuthUser = ({
	user = { email: "test@example.com" },
	loading = false,
	logout = vi.fn(),
	isGuestUser = false,
}: AuthMockOptions = {}) => {
	vi.resetModules();

	vi.doMock("@/hooks/useAuth", () => ({
		useAuth: () => ({
			user,
			loading,
			logout,
			isGuestUser,
		}),
	}));
};
