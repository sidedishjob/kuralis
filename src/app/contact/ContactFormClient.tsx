"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactSchema,
} from "@/lib/validation/contactSchema";
import { useContactSubmit } from "@/hooks/useContactSubmit";
import { ContactForm } from "./ContactForm";

export function ContactFormClient() {
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
    <FormProvider {...methods}>
      <ContactForm onSubmit={submitContact} isSuccess={isSuccess} />
    </FormProvider>
  );
}
