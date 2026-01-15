import { z } from 'zod';
import { ai } from '../genkit';

export const BmiAnalysisInputSchema = z.object({
  bmi: z.number(),
  height: z.number(),
  weight: z.number(),
});

export const analyzeBmiFlow = ai.defineFlow(
  {
    name: 'analyzeBmiFlow',
    inputSchema: BmiAnalysisInputSchema,
    outputSchema: z.string(),
  },
  async ({ bmi, height, weight }) => {
    const prompt = `Jesteś przyjaznym i zachęcającym asystentem zdrowia. Na podstawie następujących danych - BMI: ${bmi.toFixed(
      2
    )}, Wzrost: ${height} cm, Waga: ${weight} kg - przedstaw krótką, spersonalizowaną analizę (2-3 akapity). Dołącz ogólne wskazówki dotyczące stylu życia i pozytywne zachęty. Ważne: nie udzielaj porad medycznych. Twoja odpowiedź powinna być sformułowana jako ogólna informacja o zdrowiu i dobrym samopoczuciu. Odpowiedz w języku polskim.`;

    const { text } = await ai.generate({
      prompt: prompt,
    });

    return text;
  }
);
