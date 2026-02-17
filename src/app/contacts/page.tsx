'use client';

import { ContactsClient } from "@/components/contacts-client";
import { ContactForm } from "@/components/contact-form";

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Контакты</h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
          Мы всегда на связи и готовы помочь. Позвоните нам или оставьте сообщение.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <ContactsClient />
        <ContactForm />
      </div>
    </div>
  );
}
