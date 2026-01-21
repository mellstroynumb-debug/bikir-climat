'use client';

import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types';

interface OrderStatusBadgeProps {
  status: Order['status'];
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants = {
    new: 'default',
    done: 'secondary',
  } as const;

  const text = {
    new: 'Новый',
    done: 'Выполнен',
  };

  return <Badge variant={variants[status]}>{text[status]}</Badge>;
}
