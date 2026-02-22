import { redirect } from "next/navigation";
import { VerifyEmailCard } from "@/components/auth/VerifyEmailCard";

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) {
    redirect("/auth/signup");
  }

  return (
    <div className="flex items-center justify-center p-16">
      <VerifyEmailCard email={email} />
    </div>
  );
}
