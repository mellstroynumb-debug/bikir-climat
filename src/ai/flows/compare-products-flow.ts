'use server';
/**
 * @fileOverview An AI agent for comparing air conditioners.
 *
 * - compareProducts - A function that handles the product comparison.
 * - CompareProductsInput - The input type for the compareProducts function.
 * - CompareProductsOutput - The return type for the compareProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductSpecsSchema = z.object({
  title: z.string(),
  price: z.number().nullable(),
  specs: z.record(z.union([z.string(), z.number()])),
});

const CompareProductsInputSchema = z.object({
    products: z.array(ProductSpecsSchema),
    currency: z.string(),
});
export type CompareProductsInput = z.infer<typeof CompareProductsInputSchema>;

const CompareProductsOutputSchema = z.string().describe("A concise and helpful comparison of the products, written in Russian. Use newlines for formatting, but do not use Markdown.");
export type CompareProductsOutput = z.infer<typeof CompareProductsOutputSchema>;

export async function compareProducts(
  input: CompareProductsInput
): Promise<CompareProductsOutput> {
  return compareProductsFlow(input);
}

const compareProductsPrompt = ai.definePrompt(
  {
    name: 'compareProductsPrompt',
    input: { schema: CompareProductsInputSchema },
    output: { schema: CompareProductsOutputSchema },
    prompt: `Ты — эксперт по климатической технике в интернет-магазине. Твоя задача — помочь покупателю, который не разбирается в характеристиках, сделать правильный выбор между несколькими моделями кондиционеров.

Ты получишь JSON с данными о нескольких товарах. Проанализируй их и напиши короткое, но ёмкое и полезное сравнение на русском языке.

Твои рекомендации должны быть объективными. Не используй Markdown или HTML, только обычный текст и переносы строк.

Ключевые параметры для анализа:
- **Тип компрессора (inverter):** 'Да' (инвертор) — тише, экономичнее, лучше для спален. 'Нет' (on/off) — дешевле, проще, хорош для офисов или дач.
- **Мощность (power_btu):** 7000-9000 для комнат до 25м², 12000 для 25-35м², 18000+ для 35м²+ .
- **Уровень шума (noise_indoor_db):** Чем меньше, тем лучше. <25 дБ — очень тихо (для спальни). 30-35 дБ — средне. >40 дБ — шумно.
- **Класс энергоэффективности (energy_class):** A+++ — самый лучший. A++, A+ — отлично. A — хорошо. B и ниже — не очень экономично.
- **Цена (price):** Сравнивай цены и давай оценку "цена/качество".
- **Мин. t для обогрева (heating_min_temp):** Важно для тех, кто будет использовать кондиционер зимой. -15°С — стандарт, -25°С — отлично для суровых зим.

**Структура ответа:**
1.  **Общий вывод (1-2 предложения):** Сразу дай главную рекомендацию. Например: "Для тихой спальни лучше подойдет Модель А, а для большой гостиной с ограниченным бюджетом — Модель Б."
2.  **Сравнение по пунктам:**
    *   Кратко опиши идеальный сценарий для каждой модели.
    *   Сравни тишину и комфорт (уровень шума).
    *   Сравни экономичность (тип компрессора, класс энергоэффективности).
    *   Оцени, оправдана ли разница в цене.
3.  **Итоговая рекомендация:** Подведи итог, кому какую модель стоит выбрать.

**Важно:** Не просто перечисляй характеристики, а объясняй, что они значат для пользователя. Будь дружелюбным, но профессиональным.

Вот данные для анализа:
Валюта: {{{currency}}}
Товары:
{{{json products}}}
`,
  },
);


const compareProductsFlow = ai.defineFlow(
  {
    name: 'compareProductsFlow',
    inputSchema: CompareProductsInputSchema,
    outputSchema: CompareProductsOutputSchema,
  },
  async (input) => {
    const { output } = await compareProductsPrompt(input);
    return output!;
  }
);
