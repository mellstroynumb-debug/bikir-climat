import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Wrench, ThermometerSun, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'О компании | Bikir-Climat',
  description: 'Bikir-Climat -- монтаж и продажа кондиционеров и климатической техники в Приднестровье и Молдове.',
};

const stats = [
  { icon: Users, value: '500+', label: 'Довольных клиентов' },
  { icon: Award, value: '5+', label: 'Лет опыта' },
  { icon: Wrench, value: '1000+', label: 'Установок' },
  { icon: ThermometerSun, value: '9', label: 'Брендов' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">
          О компании
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Мы создаём комфортный климат в домах и офисах Приднестровья и Молдовы.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold font-headline text-foreground mb-6 text-center">
          Наша история
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <span className="font-semibold text-foreground">Bikir-Climat</span> -- это команда профессионалов, 
            специализирующихся на продаже и монтаже кондиционеров и климатической техники. 
            Мы работаем на рынке Приднестровья и Молдовы, предлагая нашим клиентам лучшие решения 
            для комфортного климата.
          </p>
          <p>
            Мы являемся официальными партнёрами ведущих мировых брендов: GREE, MIDEA, Cooper&Hunter, 
            LG, Samsung, Electrolux, Ballu, HEINNER и ONE AIR. Это позволяет нам предлагать 
            широкий ассортимент техники на любой бюджет и для любых задач.
          </p>
          <p>
            Наша команда сертифицированных специалистов выполняет полный цикл работ: 
            от консультации и подбора оборудования до профессионального монтажа и гарантийного обслуживания. 
            Мы ценим каждого клиента и стремимся к долгосрочным отношениям, основанным на доверии и качестве.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center border-border/60">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold font-headline text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Work */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-headline text-foreground mb-3">
            Наши работы
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Примеры наших установок. Мы гордимся качеством и эстетикой каждого монтажа.
          </p>
        </div>

        {/* Placeholder for future portfolio photos */}
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold font-headline text-foreground mb-2">
            Скоро здесь появятся фотографии наших работ
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Мы готовим галерею реальных фотографий наших монтажей. Следите за обновлениями.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center rounded-xl bg-secondary/50 border border-border/60 p-8 md:p-12">
        <h2 className="text-xl md:text-2xl font-bold font-headline text-foreground mb-3">
          Готовы к комфортному климату?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
          Свяжитесь с нами, и мы подберём идеальное решение для вашего дома или офиса.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Перейти в каталог
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
}
