import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MdOutlinePolicy } from "react-icons/md";

export const PolicySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MdOutlinePolicy className="size-5 mr-1" />
          ポリシー
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Link
          href="/terms"
          className="underline text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary"
        >
          利用規約
        </Link>
        <Link
          href="/privacy"
          className="underline text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary"
        >
          プライバシーポリシー
        </Link>
      </CardContent>
    </Card>
  );
};
