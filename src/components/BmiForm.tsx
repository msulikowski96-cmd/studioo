'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getBmiAnalysis } from '@/app/actions';
import { Scale, Ruler, Loader2, Calendar, VenetianMask, Activity } from 'lucide-react';
import type { BmiResultData } from '@/app/page';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  height: z.string().min(1, 'Wzrost jest wymagany.'),
  weight: z.string().min(1, 'Waga jest wymagana.'),
  age: z.string().min(1, 'Wiek jest wymagany.'),
  gender: z.string().min(1, 'Płeć jest wymagana.'),
  activityLevel: z.string().min(1, 'Poziom aktywności jest wymagany.'),
});

type BmiFormProps = {
  onAnalysisComplete: (result: BmiResultData | null) => void;
};

export function BmiForm({ onAnalysisComplete }: BmiFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: '',
      weight: '',
      age: '',
      gender: '',
      activityLevel: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAnalysisComplete(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('height', values.height);
      formData.append('weight', values.weight);
      formData.append('age', values.age);
      formData.append('gender', values.gender);
      formData.append('activityLevel', values.activityLevel);

      const result = await getBmiAnalysis(formData);

      if (result.error) {
        if (result.error._form) {
          toast({
            variant: 'destructive',
            title: 'Błąd',
            description: result.error._form[0],
          });
        }
        if (result.error.height) {
          form.setError('height', { message: result.error.height[0] });
        }
        if (result.error.weight) {
          form.setError('weight', { message: result.error.weight[0] });
        }
        if (result.error.age) {
          form.setError('age', { message: result.error.age[0] });
        }
        if (result.error.gender) {
          form.setError('gender', { message: result.error.gender[0] });
        }
        if (result.error.activityLevel) {
          form.setError('activityLevel', { message: result.error.activityLevel[0] });
        }
      } else if (result.bmi && result.analysis) {
        onAnalysisComplete({ bmi: result.bmi, analysis: result.analysis });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wzrost (cm)</FormLabel>
                    <div className="relative">
                      <Ruler className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="np. 180"
                          type="number"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waga (kg)</FormLabel>
                    <div className="relative">
                      <Scale className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="np. 75"
                          type="number"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wiek</FormLabel>
                     <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="np. 30"
                          type="number"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Płeć</FormLabel>
                    <div className="relative">
                       <VenetianMask className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Wybierz płeć" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Mężczyzna</SelectItem>
                          <SelectItem value="female">Kobieta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poziom aktywności fizycznej</FormLabel>
                      <div className="relative">
                         <Activity className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                             <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Wybierz poziom aktywności" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Siedzący tryb życia (brak lub sporadyczne ćwiczenia)</SelectItem>
                            <SelectItem value="lightly_active">Niewielka aktywność (lekkie ćwiczenia/spacery 1-3 dni w tygodniu)</SelectItem>
                            <SelectItem value="moderately_active">Umiarkowana aktywność (umiarkowane ćwiczenia 3-5 dni w tygodniu)</SelectItem>
                            <SelectItem value="very_active">Duża aktywność (intensywne ćwiczenia 6-7 dni w tygodniu)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizuję...
                </>
              ) : (
                'Oblicz i przeanalizuj BMI'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
