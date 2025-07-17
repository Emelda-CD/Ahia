'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a compelling ad title and description.
 *
 * The flow takes a few user-provided keywords and the ad category/subcategory as input
 * and returns a suggested title and description.
 *
 * @remarks
 * - suggestAdDetails - The main function that calls the Genkit flow.
 * - SuggestAdDetailsInput - The input type for the suggestAdDetails function.
 * - SuggestAdDetailsOutput - The output type for the suggestAdDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAdDetailsInputSchema = z.object({
  keywords: z.string().describe('A few keywords from the user describing the item. e.g., "blue toyota camry 2019 leather"'),
  category: z.string().describe('The primary category of the ad. e.g., "Vehicles"'),
  subcategory: z.string().describe('The subcategory of the ad. e.g., "Cars"'),
});

export type SuggestAdDetailsInput = z.infer<typeof SuggestAdDetailsInputSchema>;

const SuggestAdDetailsOutputSchema = z.object({
  title: z.string().describe('A compelling, concise title for the ad. e.g., "Clean 2019 Toyota Camry with Leather Seats"'),
  description: z.string().describe('A detailed and persuasive description for the ad, highlighting key features.'),
});

export type SuggestAdDetailsOutput = z.infer<typeof SuggestAdDetailsOutputSchema>;

export async function suggestAdDetails(input: SuggestAdDetailsInput): Promise<SuggestAdDetailsOutput> {
  return suggestAdDetailsFlow(input);
}

const suggestAdDetailsPrompt = ai.definePrompt({
  name: 'suggestAdDetailsPrompt',
  system: `You are an expert copywriter for an online marketplace in Nigeria called Ahia.ng.
You specialize in writing compelling and clear ad titles and descriptions.
You will be given keywords, a category, and a subcategory.
Your task is to generate a great title and description.
The tone should be professional but friendly. Highlight the key selling points based on the keywords.
For the description, use paragraphs to make it readable.
You MUST ONLY respond with the JSON object requested and nothing else. Do not add any conversational text or markdown formatting.`,
  input: {schema: SuggestAdDetailsInputSchema},
  output: {schema: SuggestAdDetailsOutputSchema},
  prompt: `
Keywords: {{{keywords}}}
Category: {{{category}}}
Subcategory: {{{subcategory}}}
`,
});

const suggestAdDetailsFlow = ai.defineFlow(
  {
    name: 'suggestAdDetailsFlow',
    inputSchema: SuggestAdDetailsInputSchema,
    outputSchema: SuggestAdDetailsOutputSchema,
  },
  async input => {
    const {output} = await suggestAdDetailsPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate suggestions.');
    }
    return output;
  }
);
