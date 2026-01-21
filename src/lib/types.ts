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
    inverter: string;
  };
  category: 'cond' | 'service';
};

export type CartItem = Product & {
  quantity: number;
};
