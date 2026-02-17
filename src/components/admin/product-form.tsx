'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Название обязательно'),
  brand: z.string().min(1, 'Бренд обязателен'),
  description: z.string().optional(),
  price_pmr: z.coerce.number().min(0, 'Цена должна быть положительной').nullable(),
  old_price_pmr: z.coerce.number().min(0, 'Цена должна быть положительной').nullable().optional(),
  price_md: z.coerce.number().min(0, 'Цена должна быть положительной').nullable(),
  old_price_md: z.coerce.number().min(0, 'Цена должна быть положительной').nullable().optional(),
  images: z.array(z.object({ url: z.string().url('Введите корректный URL') })).min(1, 'Нужно хотя бы одно изображение'),
  specs: z.array(z.object({
    key: z.string().min(1, 'Ключ обязателен'),
    value: z.string().min(1, 'Значение обязательно'),
  })),
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
      id: product?.id ?? '',
      title: product?.title ?? '',
      brand: product?.brand ?? '',
      description: product?.description ?? '',
      price_pmr: product?.price_pmr ?? 0,
      old_price_pmr: product?.old_price_pmr ?? null,
      price_md: product?.price_md ?? 0,
      old_price_md: product?.old_price_md ?? null,
      images: product?.images?.map(url => ({ url })) ?? [{ url: 'https://placehold.co/600x400' }],
      specs: product ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })) : [
          { key: 'inverter', value: 'Да' },
          { key: 'power_btu', value: '9000' },
          { key: 'area_sq_m', value: '25' },
          { key: 'cooling_power_w', value: '' },
          { key: 'heating_power_w', value: '' },
          { key: 'energy_class', value: '' },
          { key: 'noise_indoor_db', value: '' },
          { key: 'refrigerant', value: 'R32' },
          { key: 'wifi', value: 'Нет' },
      ],
      category: product?.category ?? 'cond',
      stockStatus: product?.stockStatus ?? true,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specs",
  });


  const onSubmit = (data: ProductFormData) => {
    const specsObject = data.specs.reduce((acc, { key, value }) => {
      if (key) {
        // Attempt to convert to number if it's a numeric string
        const numericValue = Number(value);
        acc[key] = isNaN(numericValue) || value.trim() === '' ? value : numericValue;
      }
      return acc;
    }, {} as Record<string, string | number>);

    const finalData = {
      ...data,
      images: data.images.map(img => img.url),
      specs: specsObject,
    };
    onSave(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Товара (необязательно)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="auto-generated" disabled={!!product} />
              </FormControl>
              <FormDescription>Можно задать свой ID. Если оставить пустым, сгенерируется автоматически. Нельзя менять после создания.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Бренд</FormLabel>
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
              <FormLabel>Описание (необязательно)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <FormLabel>Изображения (URL)</FormLabel>
            <div className="space-y-2 pt-2">
                {imageFields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} disabled={imageFields.length <= 1}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendImage({ url: 'https://placehold.co/600x400' })}>
                Добавить изображение
            </Button>
        </div>

        <Separator />

        <div className="space-y-4">
            <h4 className="font-medium text-sm">Цены в Приднестровье (PMR)</h4>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_pmr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текущая цена (руб)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="old_price_pmr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Старая цена (руб)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Необязательно" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="font-medium text-sm">Цены в Молдове (MD)</h4>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_md"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Текущая цена (лей)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="old_price_md"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Старая цена (лей)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Необязательно" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>
        
        <Separator />

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
        
        <div>
            <FormLabel>Характеристики</FormLabel>
            <div className="space-y-3 pt-2">
                {specFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] items-start gap-2">
                        <FormField
                            control={form.control}
                            name={`specs.${index}.key`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input placeholder="Название (напр. power_btu)" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`specs.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input placeholder="Значение (напр. 9000)" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendSpec({ key: '', value: '' })}>
                Добавить характеристику
            </Button>
        </div>
        
        <Separator />

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
