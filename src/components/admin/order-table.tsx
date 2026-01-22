'use client';

import React, { useMemo, useState } from 'react';
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
import { OrderDetailDialog } from './order-detail-dialog';


export function OrderTable() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products } = useCollection<Product>(productsQuery);

  const ordersQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')) : null,
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
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    setDocumentNonBlocking(orderRef, { status: newStatus }, { merge: true });
    toast({ title: `Статус заказа обновлен` });
  };
  
  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  }

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
    <>
        <div className="border rounded-lg overflow-hidden">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead className="hidden md:table-cell">Адрес</TableHead>
                <TableHead>Товары</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map((order) => (
                <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell className="hidden md:table-cell">{order.address}</TableCell>
                <TableCell className="text-xs">
                    {order.items.map(item => `${productsById[item.productId]?.title || 'Неизвестный товар'} (x${item.quantity})`).join(', ')}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                    {new Intl.NumberFormat('ru-RU').format(order.totalPrice)} {order.currency}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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
        <OrderDetailDialog
            isOpen={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            order={selectedOrder}
            productsById={productsById}
        />
    </>
  );
}
