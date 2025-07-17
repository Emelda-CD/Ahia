
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
  system: `You are an expert in generating relevant search tags for online classifieds.
You will be given the title and description of an ad.
Your task is to generate a list of short, relevant tags that a potential buyer might use to search for this item.
The tags should be concise and related to the product, its brand, model, condition, or features.
You MUST ONLY respond with the JSON object requested and nothing else. Do not add any conversational text or markdown formatting.`,
  input: {schema: SuggestAdTagsInputSchema},
  output: {schema: SuggestAdTagsOutputSchema},
  prompt: `
Title: {{{title}}}
Description: {{{description}}}
`,
});

const suggestAdTagsFlow = ai.defineFlow(
  {
    name: 'suggestAdTagsFlow',
    inputSchema: SuggestAdTagsInputSchema,
    outputSchema: SuggestAdTagsOutputSchema,
  },
  async input => {
    const result = await suggestAdTagsPrompt(input);
    const text = result.text;
    
    try {
      // First, try to parse the entire response as JSON
      const parsed = JSON.parse(text);
      return SuggestAdTagsOutputSchema.parse(parsed);
    } catch (e) {
      // If parsing fails, try to extract JSON from a markdown block
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const extractedJson = JSON.parse(jsonMatch[1]);
          return SuggestAdTagsOutputSchema.parse(extractedJson);
        } catch (e2) {
            console.error('Failed to parse extracted JSON:', e2);
             throw new Error('AI failed to generate suggestions in the expected format.');
        }
      }
    }
    
    // If both attempts fail, throw an error
    console.error('AI response was not valid JSON:', text);
    throw new Error('AI failed to generate suggestions in the expected format.');
  }
);
