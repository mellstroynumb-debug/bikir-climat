'use client';

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactsClient } from "@/components/contacts-client";
import { YandexMap } from "@/components/yandex-map";

const tiraspolCoords: [number, number] = [46.8403, 29.6331];
const chisinauCoords: [number, number] = [47.0269, 28.8415];

export default function ContactsPage() {
  const { region } = useStore();
  const mapCenter = region === 'PMR' ? tiraspolCoords : chisinauCoords;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
       <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Контакты</h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
          Мы всегда на связи и готовы помочь.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactsClient />

        <Card>
           <CardHeader>
                <CardTitle>Мы на карте</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <YandexMap center={mapCenter} zoom={15} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
