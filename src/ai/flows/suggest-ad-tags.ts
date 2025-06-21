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
  categories: z
    .array(z.string())
    .describe('A list of suggested categories for the ad.'),
  tags: z.array(z.string()).describe('A list of suggested tags for the ad.'),
});

export type SuggestAdTagsOutput = z.infer<typeof SuggestAdTagsOutputSchema>;

export async function suggestAdTags(input: SuggestAdTagsInput): Promise<SuggestAdTagsOutput> {
  return suggestAdTagsFlow(input);
}

const suggestAdTagsPrompt = ai.definePrompt({
  name: 'suggestAdTagsPrompt',
  input: {schema: SuggestAdTagsInputSchema},
  output: {schema: SuggestAdTagsOutputSchema},
  prompt: `You are an expert in categorizing online ads. Given the title and description of an ad, suggest relevant categories and tags.

Title: {{{title}}}
Description: {{{description}}}

Categories: A list of relevant categories.
Tags: A list of relevant tags.

Return a JSON object with "categories" and "tags" fields.`,
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
