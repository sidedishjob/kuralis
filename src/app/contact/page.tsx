"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactSchema } from "@/lib/validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContactSubmit } from "@/hooks/useContactSubmit";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  const { submitContact, isSuccess } = useContactSubmit();

  const methods = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

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
          <FormProvider {...methods}>
            <ContactForm onSubmit={submitContact} isSuccess={isSuccess} />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
