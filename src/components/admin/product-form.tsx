'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const productSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  price_pmr: z.coerce.number().min(0, 'Цена должна быть положительной').nullable(),
  price_md: z.coerce.number().min(0, 'Цена должна быть положительной').nullable(),
  images: z.array(z.string()).min(1, 'Нужно хотя бы одно изображение'),
  specs: z.object({
    area: z.string().min(1, "Площадь обязательна"),
    power: z.coerce.number().min(0).optional(),
    type: z.string().min(1, "Тип обязателен"),
    inverter: z.enum(['Да', 'Нет']),
  }),
  category: z.enum(['cond', 'service']),
  stockStatus: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      price_pmr: product?.price_pmr ?? 0,
      price_md: product?.price_md ?? 0,
      images: product?.images ?? ['https://placehold.co/600x400'],
      specs: {
        area: product?.specs.area ?? '',
        power: product?.specs.power ?? 7000,
        type: product?.specs.type ?? 'Настенный',
        inverter: product?.specs.inverter ?? 'Нет',
      },
      category: product?.category ?? 'cond',
      stockStatus: product?.stockStatus ?? true,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price_pmr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена PMR (руб)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price_md"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена MD (лей)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="cond">Кондиционер</SelectItem>
                    <SelectItem value="service">Услуга</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="specs.area"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Площадь (кв.м)</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="specs.power"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Мощность (BTU)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="specs.inverter"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Инвертор</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </Trigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Да">Да</SelectItem>
                        <SelectItem value="Нет">Нет</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="stockStatus"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>В наличии</FormLabel>
                    </div>
                    <FormControl>
                        <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />


        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
}
