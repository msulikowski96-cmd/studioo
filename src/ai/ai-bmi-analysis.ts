'use server';
/**
 * @fileOverview Analyzes BMI using AI and provides personalized health recommendations.
 *
 * - analyzeBMI - A function that analyzes the BMI and provides health recommendations.
 * - AnalyzeBMIInput - The input type for the analyzeBMI function.
 * - AnalyzeBMIOutput - The return type for the analyzeBMI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeBMIInputSchema = z.object({
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  bmi: z.number().describe('The calculated BMI of the user.'),
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe("The user's gender ('male' or 'female')."),
  activityLevel: z
    .string()
    .describe(
      "The user's physical activity level ('sedentary', 'lightly_active', 'moderately_active', 'very_active')."
    ),
});
export type AnalyzeBMIInput = z.infer<typeof AnalyzeBMIInputSchema>;

const AnalyzeBMIOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'The AI analysis of the BMI and personalized health recommendations in Polish.'
    ),
});
export type AnalyzeBMIOutput = z.infer<typeof AnalyzeBMIOutputSchema>;

export async function analyzeBMI(
  input: AnalyzeBMIInput
): Promise<AnalyzeBMIOutput> {
  return analyzeBMIFlow(input);
}

const analyzeBMIPrompt = ai.definePrompt({
  name: 'analyzeBMIPrompt',
  input: {schema: AnalyzeBMIInputSchema},
  output: {schema: AnalyzeBMIOutputSchema},
  prompt: `Jesteś przyjaznym i zachęcającym asystentem zdrowia. Na podstawie następujących danych - BMI: {{bmi}}, Wzrost: {{height}} cm, Waga: {{weight}} kg, Wiek: {{age}}, Płeć: {{gender}}, Poziom aktywności: {{activityLevel}} - przedstaw krótką, spersonalizowaną analizę (2-3 akapity). Uwzględnij płeć, wiek i poziom aktywności w swojej analizie. Dołącz ogólne wskazówki dotyczące stylu życia i pozytywne zachęty. Ważne: nie udzielaj porad medycznych. Twoja odpowiedź powinna być sformułowana jako ogólna informacja o zdrowiu i dobrym samopoczuciu. Odpowiedz w języku polskim.`,
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
