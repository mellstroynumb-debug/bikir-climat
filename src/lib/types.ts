export type Region = 'PMR' | 'MD';

export type Product = {
  id: string;
  title: string;
  description: string;
  price_pmr: number | null;
  price_md: number | null;
  images: string[];
  specs: {
    area: string;
    type: string;
    inverter: 'Да' | 'Нет';
    power?: number; // BTU
  };
  category: 'cond' | 'service';
  stockStatus: boolean;
};

export type CartItem = Product & {
  quantity: number;
};
