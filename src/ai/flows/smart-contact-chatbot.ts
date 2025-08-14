'use server';

/**
 * @fileOverview Implements a smart contact chatbot for Infynia Labs.
 *
 * - smartContactChatbot - A function that handles the chatbot interactions.
 * - SmartContactChatbotInput - The input type for the smartContactChatbot function.
 * - SmartContactChatbotOutput - The return type for the smartContactChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartContactChatbotInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});
export type SmartContactChatbotInput = z.infer<typeof SmartContactChatbotInputSchema>;

const SmartContactChatbotOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user query.'),
});
export type SmartContactChatbotOutput = z.infer<typeof SmartContactChatbotOutputSchema>;

export async function smartContactChatbot(input: SmartContactChatbotInput): Promise<SmartContactChatbotOutput> {
  return smartContactChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartContactChatbotPrompt',
  input: {schema: SmartContactChatbotInputSchema},
  output: {schema: SmartContactChatbotOutputSchema},
  prompt: `You are an AI-powered chatbot for Infynia Labs. Your goal is to answer user questions about the company, its mission, activities, products, research, and why users should choose Infynia. Be helpful and informative.

User query: {{{query}}}`,
});

const smartContactChatbotFlow = ai.defineFlow(
  {
    name: 'smartContactChatbotFlow',
    inputSchema: SmartContactChatbotInputSchema,
    outputSchema: SmartContactChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
