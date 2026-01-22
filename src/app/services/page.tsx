'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Edit } from 'lucide-react';
import { useState } from 'react';
import { QuickOrderDialog } from '@/components/quick-order-dialog';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ServiceAdvantages } from '@/components/service-advantages';

const services: (Product & { features: string[] })[] = [
  {
    id: 'service-standart-montaj',
    title: 'Стандартный монтаж',
    brand: 'Bikir Climat',
    description: 'Быстрая и качественная установка кондиционера с соблюдением всех технических норм.',
    price_pmr: 800,
    price_md: 800,
    images: ['https://placehold.co/600x400/blue/white?text=Service'],
    specs: {},
    category: 'service',
    stockStatus: true,
    features: [
      'Монтаж внутреннего и внешнего блоков',
      'Прокладка фреоновой трассы до 3 метров',
      'Подключение к электросети',
      'Пуско-наладочные работы'
    ],
  },
  {
    id: 'service-aesthetic-montaj',
    title: 'Эстетичный монтаж',
    brand: 'Bikir Climat',
    description: 'Скрытая прокладка коммуникаций для сохранения идеального вида вашего интерьера.',
    price_pmr: 1200,
    price_md: 1200,
    images: ['https://placehold.co/600x400/green/white?text=Service'],
    specs: {},
    category: 'service',
    stockStatus: true,
    features: [
      'Штробление стен (при необходимости)',
      'Установка декоративных коробов',
      'Максимально незаметное размещение блоков',
      'Уборка после монтажа'
    ],
  },
  {
    id: 'service-to',
    title: 'Техническое обслуживание',
    brand: 'Bikir Climat',
    description: 'Комплексная проверка и чистка вашего оборудования для долгой и надежной работы.',
    price_pmr: 500,
    price_md: 500,
    images: ['https://placehold.co/600x400/orange/white?text=Service'],
    specs: {},
    category: 'service',
    stockStatus: true,
    features: [
      'Чистка фильтров и теплообменников',
      'Проверка давления фреона',
      'Диагностика электроники',
      'Антибактериальная обработка'
    ],
  },
];


export default function ServicesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Product | null>(null);

    const handleOrderClick = (service: Product) => {
        setSelectedService(service);
        setIsDialogOpen(true);
    }

  return (
      <>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Наши услуги</h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
              Профессиональный подход к установке и обслуживанию климатической техники.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-3 flex-grow">
                    {service.features.map((feature: string) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                   <div className="mt-6 pt-6 border-t flex items-center justify-between">
                     <p className="font-bold text-lg text-primary">от {service.price_pmr} руб.</p>
                     <Button onClick={() => handleOrderClick(service)}>
                         <Edit className="h-4 w-4 mr-2" />
                         Заказать
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <ServiceAdvantages />
        
        {selectedService && (
            <QuickOrderDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedService}
            />
        )}
    </>
  );
}
