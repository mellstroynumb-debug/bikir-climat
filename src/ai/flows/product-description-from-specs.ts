'use server';

/**
 * @fileOverview Generates a product description based on product specifications.
 *
 * - generateProductDescription - A function that generates the product description.
 * - ProductDescriptionInput - The input type for the generateProductDescription function.
 * - ProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the product.'),
  specs: z
    .object({
      area: z.string().optional().describe('The area the product is suitable for.'),
      type: z.string().optional().describe('The type of the product.'),
      inverter: z.string().optional().describe('Whether the product is an inverter type.'),
    })
    .describe('The specifications of the product.'),
  category: z.string().describe('The category of the product (e.g., cond, service).'),
});
export type ProductDescriptionInput = z.infer<typeof ProductDescriptionInputSchema>;

const ProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type ProductDescriptionOutput = z.infer<typeof ProductDescriptionOutputSchema>;

export async function generateProductDescription(
  input: ProductDescriptionInput
): Promise<ProductDescriptionOutput> {
  return productDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: ProductDescriptionInputSchema},
  output: {schema: ProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling product descriptions for e-commerce websites.

  Based on the product's specifications and category, generate a concise and engaging description to highlight its key features and benefits.

  Product Title: {{title}}
  Category: {{category}}
  Specifications:
  {{#if specs.area}}Area: {{specs.area}}{{/if}}
  {{#if specs.type}}Type: {{specs.type}}{{/if}}
  {{#if specs.inverter}}Inverter: {{specs.inverter}}{{/if}}
  `,
});

const productDescriptionFlow = ai.defineFlow(
  {
    name: 'productDescriptionFlow',
    inputSchema: ProductDescriptionInputSchema,
    outputSchema: ProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
