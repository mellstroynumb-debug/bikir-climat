import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'CoolWave Pro',
    description: 'The most efficient and silent air conditioner for large rooms.',
    price_pmr: 4500,
    price_md: 5000,
    images: [getImage('product-1')],
    specs: {
      area: '40-60 кв.м',
      type: 'Настенный',
      inverter: 'Да',
      power: 18000,
    },
    category: 'cond',
  },
  {
    id: '2',
    title: 'Arctic Breeze 5000',
    description: 'Perfect for apartments and small offices, combining style and power.',
    price_pmr: 3200,
    price_md: 3600,
    images: [getImage('product-2')],
    specs: {
      area: '20-30 кв.м',
      type: 'Настенный',
      inverter: 'Да',
      power: 9000,
    },
    category: 'cond',
  },
  {
    id: '3',
    title: 'FrostFlow Compact',
    description: 'A compact solution for small spaces without compromising on cooling.',
    price_pmr: 2800,
    price_md: null, // Not available in MD
    images: [getImage('product-3')],
    specs: {
      area: 'до 20 кв.м',
      type: 'Настенный',
      inverter: 'Нет',
      power: 7000,
    },
    category: 'cond',
  },
  {
    id: '4',
    title: 'EcoChill 9000',
    description: 'Eco-friendly and powerful, ideal for environmentally conscious users.',
    price_pmr: 5100,
    price_md: 5800,
    images: [getImage('product-4')],
    specs: {
      area: '35-50 кв.м',
      type: 'Настенный',
      inverter: 'Да',
      power: 12000,
    },
    category: 'cond',
  },
];
