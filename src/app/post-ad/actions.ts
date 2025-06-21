'use server';

import { suggestAdTags, type SuggestAdTagsInput, type SuggestAdTagsOutput } from '@/ai/flows/suggest-ad-tags';

export async function handleSuggestTags(input: SuggestAdTagsInput): Promise<SuggestAdTagsOutput> {
  try {
    const result = await suggestAdTags(input);
    return result;
  } catch (error) {
    console.error('Error suggesting ad tags:', error);
    // In a real app, you might want to return a more specific error object
    // For now, re-throwing will be caught by the client component's try-catch block
    throw new Error('Failed to get suggestions from AI.');
  }
}
