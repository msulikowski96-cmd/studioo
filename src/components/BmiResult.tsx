import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';

type BmiResultProps = {
  bmi: number;
  analysis: string;
};

function getBmiCategory(bmi: number) {
  if (bmi < 18.5)
    return {
      name: 'Niedowaga',
      icon: <TrendingDown className="h-8 w-8 text-blue-500" />,
    };
  if (bmi < 25)
    return {
      name: 'Waga prawidłowa',
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
    };
  if (bmi < 30)
    return {
      name: 'Nadwaga',
      icon: <TrendingUp className="h-8 w-8 text-yellow-500" />,
    };
  return {
    name: 'Otyłość',
    icon: <TrendingUp className="h-8 w-8 text-red-500" />,
  };
}

export function BmiResult({ bmi, analysis }: BmiResultProps) {
  const category = getBmiCategory(bmi);
  const formattedBmi = bmi.toFixed(1);

  return (
    <div className="w-full space-y-8 animate-in fade-in-0 slide-in-from-top-5 duration-500">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
          <CardTitle className="text-sm font-medium">Twoje BMI</CardTitle>
          {category.icon}
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-5xl font-bold">{formattedBmi}</div>
          <p className="text-xs text-muted-foreground">{category.name}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analiza AI</CardTitle>
          <Sparkles className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </CardContent>
      </Card>
    </div>
  );
}
