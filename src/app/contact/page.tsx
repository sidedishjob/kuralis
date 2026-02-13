import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactFormClient } from "./ContactFormClient";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>お問い合わせ</CardTitle>
          <CardDescription>
            ご質問やご要望がございましたら、以下のフォームよりお気軽にお問い合わせください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactFormClient />
        </CardContent>
      </Card>
    </div>
  );
}
