'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate submission delay (replace with actual API call later)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col items-center justify-center flex-grow py-12 text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold font-headline text-foreground mb-2">
            Сообщение отправлено
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Спасибо за обращение! Мы свяжемся с вами в ближайшее время.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setIsSubmitted(false)}
          >
            Отправить ещё
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Напишите нам</CardTitle>
        <p className="text-sm text-muted-foreground">
          Оставьте сообщение, и мы ответим вам как можно скорее.
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Ваше имя</Label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-phone">Телефон</Label>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+373 ..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">
              Email <span className="text-muted-foreground font-normal">(необязательно)</span>
            </Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="example@mail.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Сообщение</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Опишите ваш вопрос или запрос..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Отправка...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Отправить сообщение
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
