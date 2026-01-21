import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const services = [
  {
    title: 'Стандартный монтаж',
    description: 'Быстрая и качественная установка кондиционера с соблюдением всех технических норм.',
    features: [
      'Монтаж внутреннего и внешнего блоков',
      'Прокладка фреоновой трассы до 3 метров',
      'Подключение к электросети',
      'Пуско-наладочные работы'
    ],
  },
  {
    title: 'Эстетичный монтаж',
    description: 'Скрытая прокладка коммуникаций для сохранения идеального вида вашего интерьера.',
    features: [
      'Штробление стен (при необходимости)',
      'Установка декоративных коробов',
      'Максимально незаметное размещение блоков',
      'Уборка после монтажа'
    ],
  },
  {
    title: 'Техническое обслуживание',
    description: 'Комплексная проверка и чистка вашего оборудования для долгой и надежной работы.',
    features: [
      'Чистка фильтров и теплообменников',
      'Проверка давления фреона',
      'Диагностика электроники',
      'Антибактериальная обработка'
    ],
  },
];


export default function ServicesPage() {
  return (
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
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
               <p className="text-right font-bold text-lg text-primary mt-6">от 500 руб.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
