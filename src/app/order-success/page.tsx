import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="mt-4 !mb-2 text-2xl font-bold">Спасибо за ваш заказ!</CardTitle>
                <CardDescription>
                    Ваш заказ успешно оформлен. Наш менеджер скоро свяжется с вами для подтверждения деталей.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/catalog">Продолжить покупки</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
