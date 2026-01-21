'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PinFormProps {
  onSubmit: (pin: string) => void;
}

export function PinForm({ onSubmit }: PinFormProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pin);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Доступ к панели</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Введите PIN-код"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center"
            />
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
