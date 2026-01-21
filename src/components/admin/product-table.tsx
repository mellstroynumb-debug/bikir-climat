'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async (productId: string) => {
        try {
            await deleteDoc(doc(firestore, 'products', productId));
            toast({ title: 'Товар успешно удален' });
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить товар.',
                variant: 'destructive',
            });
        }
    };
  
    return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Изобр.</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена PMR</TableHead>
            <TableHead>Цена MD</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.price_pmr ?? 'N/A'}</TableCell>
              <TableCell>{product.price_md ?? 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={product.stockStatus ? 'default' : 'destructive'}>
                  {product.stockStatus ? 'В наличии' : 'Нет в наличии'}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                  Изм.
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Удал.</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя будет отменить. Товар будет навсегда удален.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)}>Удалить</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
