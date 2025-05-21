import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignupForm />
			</div>
		</div>
	);
}
