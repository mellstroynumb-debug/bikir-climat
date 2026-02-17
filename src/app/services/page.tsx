'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { QuickOrderDialog } from '@/components/quick-order-dialog'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ServiceAdvantages } from '@/components/service-advantages'
import { useStore } from '@/store/useStore'

/* Services are now static since we removed the "service" category.
   You can later add a separate "services" collection if needed. */

const staticServices = [
  {
    id: 'service-montaj-standard',
    title: 'Стандартный монтаж кондиционера',
    description: 'Установка настенного кондиционера с прокладкой трассы до 3 метров. Включает бурение одного отверстия, установку внутреннего и наружного блоков, вакуумирование и пуско-наладку.',
    price_pmr: 2500,
    price_md: 3500,
    stock_status: true,
  },
  {
    id: 'service-montaj-slozhnyj',
    title: 'Сложный монтаж кондиционера',
    description: 'Установка кондиционера с прокладкой трассы более 3 метров, высотные работы или нестандартные условия монтажа. Цена рассчитывается индивидуально.',
    price_pmr: 4000,
    price_md: 5500,
    stock_status: true,
  },
  {
    id: 'service-obsluzhivanie',
    title: 'Техническое обслуживание',
    description: 'Чистка внутреннего и наружного блоков, проверка давления фреона, дезинфекция теплообменника, проверка дренажной системы.',
    price_pmr: 500,
    price_md: 700,
    stock_status: true,
  },
  {
    id: 'service-demontaj',
    title: 'Демонтаж кондиционера',
    description: 'Аккуратный демонтаж кондиционера с сохранением фреона. Снятие внутреннего и наружного блоков.',
    price_pmr: 1500,
    price_md: 2000,
    stock_status: true,
  },
]

export default function ServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Product | null>(null)
  const { region } = useStore()
  const currency = region === 'PMR' ? 'руб.' : 'лей'

  const handleOrderClick = (service: typeof staticServices[0]) => {
    const product: Product = {
      id: service.id,
      title: service.title,
      brand: '',
      description: service.description,
      category_id: 'service',
      price_pmr: service.price_pmr,
      old_price_pmr: null,
      price_md: service.price_md,
      old_price_md: null,
      images: [],
      specs: [],
      stock_status: service.stock_status,
      sort_order: 0,
    }
    setSelectedService(product)
    setIsDialogOpen(true)
  }

  const renderPrice = (service: typeof staticServices[0]) => {
    const price = region === 'PMR' ? service.price_pmr : service.price_md
    if (!price) return <span className="text-sm text-muted-foreground">{'Цена по запросу'}</span>
    return `от ${new Intl.NumberFormat('ru-RU').format(price)} ${currency}`
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans text-balance">{'Наши услуги'}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
            {'Профессиональный подход к установке и обслуживанию климатической техники.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticServices.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader><CardTitle>{service.title}</CardTitle></CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="prose prose-sm text-muted-foreground mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }} />
                <div className="flex-grow" />
                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <p className="font-bold text-lg text-primary">{renderPrice(service)}</p>
                  <Button onClick={() => handleOrderClick(service)}>
                    <Edit className="h-4 w-4 mr-2" />{'Заказать'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ServiceAdvantages />

      {selectedService && (
        <QuickOrderDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} product={selectedService} />
      )}
    </>
  )
}
