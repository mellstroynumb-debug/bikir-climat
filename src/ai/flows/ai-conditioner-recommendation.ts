'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending air conditioners based on user input.
 *
 * The flow takes user preferences as input and returns a recommended air conditioner product.
 * It uses a prompt to generate the recommendation.
 *
 * @fileOverview This file defines a Genkit flow for recommending air conditioners based on user input.
 *
 * @fileOverview Contains:
 * - `recommendAirConditioner`: A function to initiate the air conditioner recommendation process.
 * - `AIConditionerRecommendationInput`: The input type for the `recommendAirConditioner` function.
 * - `AIConditionerRecommendationOutput`: The output type for the `recommendAirConditioner` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIConditionerRecommendationInputSchema = z.object({
  roomType: z.enum(['house', 'apartment', 'office']).describe('The type of room to be cooled.'),
  roomSizeSqFt: z.number().describe('The size of the room in square feet.'),
  budget: z.number().optional().describe('The budget for the air conditioner.'),
  coolingPreference: z.string().optional().describe('Any specific cooling preferences.'),
});

export type AIConditionerRecommendationInput = z.infer<typeof AIConditionerRecommendationInputSchema>;

const AIConditionerRecommendationOutputSchema = z.object({
  recommendedProduct: z.string().describe('The recommended air conditioner product.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});

export type AIConditionerRecommendationOutput = z.infer<typeof AIConditionerRecommendationOutputSchema>;

export async function recommendAirConditioner(
  input: AIConditionerRecommendationInput
): Promise<AIConditionerRecommendationOutput> {
  return aiConditionerRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConditionerRecommendationPrompt',
  input: {schema: AIConditionerRecommendationInputSchema},
  output: {schema: AIConditionerRecommendationOutputSchema},
  prompt: `Based on the following information, recommend an air conditioner product:

Room Type: {{roomType}}
Room Size: {{roomSizeSqFt}} square feet
Budget: {{budget}}
Cooling Preference: {{coolingPreference}}

Consider the room type, room size, budget, and cooling preference to recommend the most suitable air conditioner. Explain the reasoning behind your choice.
`,
});

const aiConditionerRecommendationFlow = ai.defineFlow(
  {
    name: 'aiConditionerRecommendationFlow',
    inputSchema: AIConditionerRecommendationInputSchema,
    outputSchema: AIConditionerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
