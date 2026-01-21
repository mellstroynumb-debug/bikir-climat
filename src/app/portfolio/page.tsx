import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const portfolioImages = PlaceHolderImages.filter(img => img.id.startsWith('portfolio-'));

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Наши работы</h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
          Примеры наших установок. Мы гордимся качеством и эстетикой.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioImages.map((image, index) => (
          <Card key={index} className="overflow-hidden group">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
