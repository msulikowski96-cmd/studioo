'use client';

import { useState } from 'react';
import { BmiForm } from '@/components/BmiForm';
import { BmiResult } from '@/components/BmiResult';
import { Header } from '@/components/Header';
import { Separator } from '@/components/ui/separator';

export type BmiResultData = {
  bmi: number;
  analysis: string;
};

export default function Home() {
  const [result, setResult] = useState<BmiResultData | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <Header />
        <section className="mt-8">
          <BmiForm onAnalysisComplete={setResult} />
        </section>

        {result && (
          <>
            <Separator className="my-12 bg-primary/20" />
            <section>
              <BmiResult bmi={result.bmi} analysis={result.analysis} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
