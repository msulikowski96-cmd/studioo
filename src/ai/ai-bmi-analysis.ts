'use server';
/**
 * @fileOverview Analyzes BMI using AI and provides personalized health recommendations.
 *
 * - analyzeBMI - A function that analyzes the BMI and provides health recommendations.
 * - AnalyzeBMIInput - The input type for the analyzeBMI function.
 * - AnalyzeBMIOutput - The return type for the analyzeBMI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBMIInputSchema = z.object({
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  bmi: z.number().describe('The calculated BMI of the user.'),
});
export type AnalyzeBMIInput = z.infer<typeof AnalyzeBMIInputSchema>;

const AnalyzeBMIOutputSchema = z.object({
  analysis: z.string().describe('The AI analysis of the BMI and personalized health recommendations.'),
});
export type AnalyzeBMIOutput = z.infer<typeof AnalyzeBMIOutputSchema>;

export async function analyzeBMI(input: AnalyzeBMIInput): Promise<AnalyzeBMIOutput> {
  return analyzeBMIFlow(input);
}

const analyzeBMIPrompt = ai.definePrompt({
  name: 'analyzeBMIPrompt',
  input: {schema: AnalyzeBMIInputSchema},
  output: {schema: AnalyzeBMIOutputSchema},
  prompt: `You are a health and wellness expert. Analyze the provided BMI and provide personalized health recommendations and lifestyle tips.

Height: {{height}} cm
Weight: {{weight}} kg
BMI: {{bmi}}

Analysis and Recommendations:`,
});

const analyzeBMIFlow = ai.defineFlow(
  {
    name: 'analyzeBMIFlow',
    inputSchema: AnalyzeBMIInputSchema,
    outputSchema: AnalyzeBMIOutputSchema,
  },
  async input => {
    const {output} = await analyzeBMIPrompt(input);
    return output!;
  }
);
