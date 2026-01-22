'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Order, Product } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import Image from 'next/image';

interface OrderDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order | null;
  productsById: Record<string, Product>;
}

export function OrderDetailDialog({
  isOpen,
  onOpenChange,
  order,
  productsById,
}: OrderDetailDialogProps) {
  if (!order) return null;

  const currency = order.currency === 'PMR' ? 'руб.' : 'лей';

  const statusText = {
    new: 'Новый',
    done: 'Выполнен',
  };

  const statusVariant = {
    new: 'default',
    done: 'secondary',
  } as const;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Детали заказа #{order.id.slice(0, 7)}</DialogTitle>
          <DialogDescription>
            Заказ от {new Date(order.createdAt?.toDate()).toLocaleString('ru-RU')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Клиент</h4>
            <p className="text-sm">
              <span className="text-muted-foreground">Имя:</span> {order.customerName}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Телефон:</span> {order.phone}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Адрес:</span> {order.address}
            </p>
          </div>
          {/* Order Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Заказ</h4>
            <div className="text-sm flex items-center">
              <span className="text-muted-foreground mr-2">Статус:</span>{' '}
              <Badge variant={statusVariant[order.status]}>
                {statusText[order.status]}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="text-muted-foreground">Сумма:</span>{' '}
              {new Intl.NumberFormat('ru-RU').format(order.totalPrice)} {currency}
            </p>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div className="py-4">
            <h4 className="font-semibold mb-3">Товары в заказе</h4>
            <ul className="space-y-3">
                {order.items.map((item, index) => {
                    const product = productsById[item.productId];
                    if (!product) return (
                        <li key={index} className="text-sm text-destructive">
                            Товар с ID: {item.productId} не найден.
                        </li>
                    )

                    const itemPrice = order.currency === 'PMR' ? product.price_pmr : product.price_md;

                    return (
                        <li key={item.productId} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
                             <Image
                                src={product.images[0]}
                                alt={product.title}
                                width={40}
                                height={40}
                                className="rounded-md object-cover border"
                            />
                            <div className="flex-grow">
                                <p className="font-medium text-sm">{product.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {item.quantity} шт. x {new Intl.NumberFormat('ru-RU').format(itemPrice || 0)} {currency}
                                </p>
                            </div>
                            <p className="font-semibold text-sm">
                                {new Intl.NumberFormat('ru-RU').format((itemPrice || 0) * item.quantity)} {currency}
                            </p>
                        </li>
                    )
                })}
            </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
