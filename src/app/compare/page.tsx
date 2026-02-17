'use client';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/lib/types';


const specLabels: Record<string, string> = {
  inverter: 'Инвертор',
  power_btu: 'Мощность (BTU)',
  area_sq_m: 'Площадь (м²)',
  brand: 'Бренд',
  cooling_power_w: 'Мощность охлаждения (Вт)',
  heating_power_w: 'Мощность обогрева (Вт)',
  energy_class: 'Класс энергоэффективности',
  noise_indoor_db: 'Уровень шума (вн. блок, дБ)',
  refrigerant: 'Тип хладагента',
  wifi: 'Подключение к Wi-Fi',
  features: 'Дополнительные функции',
  heating_min_temp: 'Мин. t для обогрева (°С)',
};


export default function ComparePage() {
    const { compare, region } = useStore();
    const currency = region === 'PMR' ? 'руб.' : 'лей';

    if (compare.length === 0) {
        return (
             <div className="container mx-auto px-4 py-12 text-center">
                <Scale className="mx-auto h-24 w-24 text-muted-foreground" />
                <h1 className="mt-4 text-2xl font-bold">Нет товаров для сравнения</h1>
                <p className="mt-2 text-muted-foreground">Добавьте товары, чтобы сравнить их характеристики.</p>
                <Button asChild className="mt-6">
                    <Link href="/catalog">Перейти в каталог</Link>
                </Button>
            </div>
        )
    }
    
    // Aggregate all possible spec keys
    const allSpecKeys = Array.from(new Set(compare.flatMap(p => Object.keys(p.specs))));

    return (
        <div className="container mx-auto px-4 py-12">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-headline">Сравнение товаров</h1>
            </div>
            
            <div className="overflow-x-auto border rounded-lg">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] font-semibold">Характеристика</TableHead>
                            {compare.map(product => (
                                <TableHead key={product.id} className="w-[250px] p-2">
                                    <Link href={`/catalog/${product.id}`} className="flex flex-col items-center text-center gap-2">
                                        <Image src={product.images[0]} alt={product.title} width={100} height={100} className="rounded-md object-contain border" />
                                        <span className="font-semibold text-foreground hover:text-primary text-sm">{product.title}</span>
                                    </Link>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         <TableRow className="bg-secondary/50">
                            <TableCell className="font-semibold">Цена</TableCell>
                            {compare.map(product => {
                                const price = region === 'PMR' ? product.price_pmr : product.price_md;
                                return (
                                    <TableCell key={product.id} className="font-bold text-lg text-primary text-center">
                                        {price ? `${new Intl.NumberFormat('ru-RU').format(price)} ${currency}` : 'N/A'}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                       {allSpecKeys.map(key => (
                           <TableRow key={key}>
                               <TableCell className="font-semibold text-muted-foreground">{specLabels[key] || key}</TableCell>
                               {compare.map(product => {
                                    const value = product.specs[key];
                                    let displayValue = value === null || value === undefined || value === '' ? '—' : String(value);
                                    if (typeof value === 'boolean') {
                                        displayValue = value ? 'Да' : 'Нет';
                                    }
                                   return (
                                     <TableCell key={product.id} className="text-center text-sm">
                                        {displayValue}
                                     </TableCell>
                                  )
                               })}
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
