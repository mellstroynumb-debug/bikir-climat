import { Truck, CreditCard, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Доставка и оплата | Bikir-Climat',
  description: 'Информация о доставке и способах оплаты кондиционеров и климатической техники в Приднестровье и Молдове.',
};

const deliveryZones = [
  {
    region: 'Приднестровье (ПМР)',
    description: 'Доставка по Тирасполю и Бендерам -- бесплатно при заказе от 3 000 руб. По остальным городам ПМР стоимость доставки рассчитывается индивидуально.',
    timing: 'от 1 до 3 рабочих дней',
  },
  {
    region: 'Молдова',
    description: 'Доставка по Кишинёву и пригородам. По другим городам Молдовы стоимость доставки рассчитывается индивидуально.',
    timing: 'от 2 до 5 рабочих дней',
  },
];

const paymentMethods = [
  {
    title: 'Наличные',
    description: 'Оплата наличными при получении товара курьеру или при самовывозе.',
    icon: CreditCard,
  },
  {
    title: 'Банковский перевод',
    description: 'Перевод на расчётный счёт компании. Реквизиты предоставляются после оформления заказа.',
    icon: ShieldCheck,
  },
  {
    title: 'Онлайн-перевод',
    description: 'Перевод через мобильный банк или платёжные системы. Детали уточняйте у менеджера.',
    icon: CreditCard,
  },
];

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">
          Доставка и оплата
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Мы доставляем кондиционеры и климатическое оборудование по всему Приднестровью и Молдове. Ниже вы найдёте информацию о зонах доставки и доступных способах оплаты.
        </p>
      </div>

      {/* Delivery Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline text-foreground">Доставка</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryZones.map((zone) => (
            <Card key={zone.region} className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-headline text-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                  {zone.region}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {zone.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Сроки:</span>
                  <span className="text-muted-foreground">{zone.timing}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-primary/5 border border-primary/10 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Важно:</span> точная стоимость и сроки доставки зависят от вашего местоположения и габаритов заказа. Для уточнения деталей свяжитесь с нашим менеджером по телефону или через форму на странице{' '}
            <Link href="/contacts" className="text-primary hover:underline">
              контактов
            </Link>.
          </p>
        </div>
      </section>

      {/* Payment Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline text-foreground">Способы оплаты</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.title} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <method.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold font-headline text-foreground mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center rounded-xl bg-secondary/50 border border-border/60 p-8 md:p-12">
        <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-bold font-headline text-foreground mb-3">
          Остались вопросы?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
          Свяжитесь с нами, и наш менеджер поможет вам с выбором, расскажет о доставке и подберёт удобный способ оплаты.
        </p>
        <Link
          href="/contacts"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Связаться с нами
        </Link>
      </section>
    </div>
  );
}
