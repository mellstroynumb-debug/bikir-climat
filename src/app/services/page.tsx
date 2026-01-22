'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { QuickOrderDialog } from '@/components/quick-order-dialog';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ServiceAdvantages } from '@/components/service-advantages';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useStore } from '@/store/useStore';

export default function ServicesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Product | null>(null);

    const firestore = useFirestore();
    const { region } = useStore();
    const currency = region === 'PMR' ? 'руб.' : 'лей';

    const servicesQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'products'), where('category', '==', 'service')) : null,
        [firestore]
    );
    const { data: services, isLoading } = useCollection<Product>(servicesQuery);

    const handleOrderClick = (service: Product) => {
        setSelectedService(service);
        setIsDialogOpen(true);
    }

    const renderPrice = (service: Product) => {
        const price = region === 'PMR' ? service.price_pmr : service.price_md;
        if (!price) {
            return <span className="text-sm text-muted-foreground">Цена по запросу</span>;
        }
        return `от ${new Intl.NumberFormat('ru-RU').format(price)} ${currency}`;
    }

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
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

          {!services || services.length === 0 ? (
            <div className="text-center py-10 border bg-secondary/30 rounded-lg">
                <p className="font-semibold">Услуги пока не добавлены.</p>
                <p className="text-sm text-muted-foreground mt-1">Их можно добавить в панели администратора.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                <Card key={service.id} className="flex flex-col">
                    <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                    {service.description && (
                        <div 
                            className="prose prose-sm text-muted-foreground mb-6 flex-grow"
                            dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }} 
                        />
                    )}
                    <div className="flex-grow" />
                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                        <p className="font-bold text-lg text-primary">{renderPrice(service)}</p>
                        <Button onClick={() => handleOrderClick(service)} disabled={!service.stockStatus}>
                            <Edit className="h-4 w-4 mr-2" />
                            Заказать
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}
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
