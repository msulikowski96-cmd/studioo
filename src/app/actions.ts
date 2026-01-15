'use server';

import { analyzeBMI, AnalyzeBMIInput } from '@/ai/ai-bmi-analysis';
import { z } from 'zod';

const BmiSchema = z.object({
  height: z.coerce.number().int().positive('Wzrost musi być liczbą dodatnią.').min(50, "Wzrost musi wynosić co najmniej 50 cm.").max(250, "Wzrost nie może przekraczać 250 cm."),
  weight: z.coerce.number().positive('Waga musi być liczbą dodatnią.').min(20, "Waga musi wynosić co najmniej 20 kg.").max(300, "Waga nie może przekraczać 300 kg."),
  age: z.coerce.number().int().positive('Wiek musi być liczbą dodatnią.').min(1, "Wiek musi wynosić co najmniej 1 rok.").max(120, "Wiek nie może przekraczać 120 lat."),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Proszę wybrać płeć.' }) }),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'], { errorMap: () => ({ message: 'Proszę wybrać poziom aktywności.' }) }),
});

type ActionState = {
  bmi?: number;
  analysis?: string;
  error?: {
    _form?: string[];
    height?: string[];
    weight?: string[];
    age?: string[];
    gender?: string[];
    activityLevel?: string[];
  }
}

export async function getBmiAnalysis(formData: FormData): Promise<ActionState> {
  const validatedFields = BmiSchema.safeParse({
    height: formData.get('height'),
    weight: formData.get('weight'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    activityLevel: formData.get('activityLevel'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { height, weight, age, gender, activityLevel } = validatedFields.data;

  // Calculate BMI: weight (kg) / (height (m))^2
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  try {
    const input: AnalyzeBMIInput = { bmi, height, weight, age, gender, activityLevel };
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
