import Hero from "@/components/hero";
import ProductList from "@/components/product-list";
import { mockProducts } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12 font-headline">Популярные модели</h2>
        <ProductList products={mockProducts} />
      </div>
    </div>
  );
}
