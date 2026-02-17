'use client';
import Image from 'next/image';

const brands = [
  { name: 'MIDEA', logo: '/brands/midea.jpg' },
  { name: 'GREE', logo: '/brands/gree.jpg' },
  { name: 'Cooper&Hunter', logo: '/brands/cooper-hunter.jpg' },
  { name: 'LG', logo: '/brands/lg.jpg' },
  { name: 'Samsung', logo: '/brands/samsung.jpg' },
  { name: 'Electrolux', logo: '/brands/electrolux.jpg' },
  { name: 'Ballu', logo: '/brands/ballu.jpg' },
  { name: 'HEINNER', logo: '/brands/heinner.jpg' },
  { name: 'ONE AIR', logo: '/brands/one-air.jpg' },
];

export function BrandsCarousel() {
  return (
    <section className="py-12 md:py-16 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center font-headline mb-10">
          Популярные бренды
        </h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-secondary/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-secondary/50 to-transparent" />

        {/* Scrolling track */}
        <div className="flex animate-scroll-brands">
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 mx-4 md:mx-8"
            >
              <div className="flex items-center justify-center w-32 h-20 md:w-44 md:h-24 rounded-xl bg-card border border-border/60 p-4 transition-shadow hover:shadow-md">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="object-contain max-h-full max-w-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
