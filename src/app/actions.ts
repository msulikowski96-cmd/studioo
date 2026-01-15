'use server';

import { analyzeBMI, AnalyzeBMIInput } from '@/ai/ai-bmi-analysis';
import { z } from 'zod';

const BmiSchema = z.object({
  height: z.coerce.number().int().positive('Wzrost musi być liczbą dodatnią.').min(50, "Wzrost musi wynosić co najmniej 50 cm.").max(250, "Wzrost nie może przekraczać 250 cm."),
  weight: z.coerce.number().positive('Waga musi być liczbą dodatnią.').min(20, "Waga musi wynosić co najmniej 20 kg.").max(300, "Waga nie może przekraczać 300 kg."),
});

type ActionState = {
  bmi?: number;
  analysis?: string;
  error?: {
    _form?: string[];
    height?: string[];
    weight?: string[];
  }
}

export async function getBmiAnalysis(formData: FormData): Promise<ActionState> {
  const validatedFields = BmiSchema.safeParse({
    height: formData.get('height'),
    weight: formData.get('weight'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { height, weight } = validatedFields.data;

  // Calculate BMI: weight (kg) / (height (m))^2
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  try {
    const input: AnalyzeBMIInput = { bmi, height, weight };
    const result = await analyzeBMI(input);
    return {
      bmi: bmi,
      analysis: result.analysis,
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      bmi: bmi,
      error: { _form: ['Wystąpił błąd podczas analizy AI. Spróbuj ponownie później.'] },
    };
  }
}
