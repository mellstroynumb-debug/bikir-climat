'use client';

import { useStore } from '@/store/useStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { sendTelegramNotification } from '@/app/actions/telegram';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().min(5, 'Введите корректный номер телефона'),
  address: z.string().min(5, 'Адрес должен содержать не менее 5 символов'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, region, getCartTotal, clearCart } = useStore();
  const total = getCartTotal();
  const currency = region === 'PMR' ? 'руб.' : 'лей';
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      address: '',
    },
  });

  // Hydration safety
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isClient && cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart, router, isClient]);

  if (!isClient || cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        {/* Or a loading skeleton */}
      </div>
    );
  }

  const onSubmit = async (formData: CheckoutFormData) => {
    if (!firestore) {
        toast({ title: "Ошибка", description: "База данных не инициализирована.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        const orderCurrency = region === 'PMR' ? 'PMR' : 'MD';
        const newOrderData = {
            ...formData,
            items: cart.map(item => item.id),
            totalPrice: total,
            currency: orderCurrency,
            status: 'new' as const,
            createdAt: serverTimestamp(),
        };

        const ordersCollection = collection(firestore, 'orders');
        const newOrderRef = await addDocumentNonBlocking(ordersCollection, newOrderData);

        const serializableOrderData = {
          ...newOrderData,
          createdAt: Timestamp.now().toJSON(),
        };
        
        const cartItemsForTelegram = cart.map(item => ({ title: item.title, quantity: item.quantity }));

        await sendTelegramNotification(newOrderRef.id, serializableOrderData, cartItemsForTelegram, 'cart');
        
        toast({
            title: 'Заказ успешно оформлен!',
            description: 'Мы скоро с вами свяжемся.',
        });

        clearCart();
        router.push('/order-success');

    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold font-headline mb-8">Оформление заказа</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* Order Summary */}
        <div className="lg:col-span-2 order-last lg:order-first">
          <Card>
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y -mx-6 px-6">
                {cart.map((item) => {
                  const itemPrice = region === 'PMR' ? item.price_pmr : item.price_md;
                  return (
                    <li key={item.id} className="flex py-4">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="rounded-md object-cover border"
                      />
                      <div className="ml-4 flex-1 flex justify-between">
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-muted-foreground text-sm">Кол-во: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm whitespace-nowrap">
                            {itemPrice ? `${new Intl.NumberFormat('ru-RU').format(itemPrice * item.quantity)} ${currency}` : ''}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
                <Separator />
                <div className="w-full flex justify-between font-bold text-lg">
                  <span>Итого</span>
                  <span>{new Intl.NumberFormat('ru-RU').format(total)} {currency}</span>
                </div>
            </CardFooter>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ваше имя</FormLabel>
                        <FormControl>
                            <Input placeholder="Иван" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Номер телефона</FormLabel>
                        <FormControl>
                            <Input placeholder="+373 777 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Адрес доставки</FormLabel>
                        <FormControl>
                            <Input placeholder="г. Тирасполь, ул. Ленина, 1" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
                    </Button>
                </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
