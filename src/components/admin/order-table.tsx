'use client';

import React, { useMemo } from 'react';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import type { Order, Product } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge } from './order-status-badge';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';


export function OrderTable() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const { data: products } = useCollection<Product>(productsQuery);

  const ordersQuery = useMemoFirebase(
    () => query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')),
    [firestore]
  );
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const productsById = useMemo(() => {
    if (!products) return {};
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, Product>);
  }, [products]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const orderRef = doc(firestore, 'orders', orderId);
    setDocumentNonBlocking(orderRef, { status: newStatus }, { merge: true });
    toast({ title: `Статус заказа обновлен` });
  };

  const formatDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString('ru-RU');
    }
    // Fallback for cases where it might not be a Timestamp object yet
    if (timestamp && typeof timestamp.toDate === 'function') {
         return timestamp.toDate().toLocaleString('ru-RU');
    }
    return 'Недавно';
  };

  if (isLoading) {
    return <div className="text-center p-8">Загрузка заказов...</div>;
  }

  if (!orders || orders.length === 0) {
      return <div className="text-center p-8 text-muted-foreground">Пока нет ни одного заказа.</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Товары</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell className="text-xs">
                {order.items.map(itemId => productsById[itemId]?.title || 'Неизвестный товар').join(', ')}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Intl.NumberFormat('ru-RU').format(order.totalPrice)} {order.currency}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue asChild>
                       <OrderStatusBadge status={order.status} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="done">Выполнен</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
