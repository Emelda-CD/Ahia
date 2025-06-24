// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant ad categories and tags based on the ad's title and description.
 *
 * The flow takes an ad title and description as input and returns a list of suggested categories and tags.
 *
 * @remarks
 * - suggestAdTags - The main function that calls the Genkit flow.
 * - SuggestAdTagsInput - The input type for the suggestAdTags function.
 * - SuggestAdTagsOutput - The output type for the suggestAdTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAdTagsInputSchema = z.object({
  title: z.string().describe('The title of the ad.'),
  description: z.string().describe('The description of the ad.'),
});

export type SuggestAdTagsInput = z.infer<typeof SuggestAdTagsInputSchema>;

const SuggestAdTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of short, relevant keywords for the ad that a user might search for. Example: ["used car", "toyota", "camry 2019", "sedan"]').max(10),
});

export type SuggestAdTagsOutput = z.infer<typeof SuggestAdTagsOutputSchema>;

export async function suggestAdTags(input: SuggestAdTagsInput): Promise<SuggestAdTagsOutput> {
  return suggestAdTagsFlow(input);
}

const suggestAdTagsPrompt = ai.definePrompt({
  name: 'suggestAdTagsPrompt',
  input: {schema: SuggestAdTagsInputSchema},
  output: {schema: SuggestAdTagsOutputSchema},
  prompt: `You are an expert in generating relevant search tags for online classifieds.
Based on the ad's title and description, generate a list of short, relevant tags that a potential buyer might use to search for this item.
The tags should be concise and related to the product, its brand, model, condition, or features.

Title: {{{title}}}
Description: {{{description}}}

Return a JSON object with a "tags" field containing an array of strings.`,
});

const suggestAdTagsFlow = ai.defineFlow(
  {
    name: 'suggestAdTagsFlow',
    inputSchema: SuggestAdTagsInputSchema,
    outputSchema: SuggestAdTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestAdTagsPrompt(input);
    return output!;
  }
);
