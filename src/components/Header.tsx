import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <BrainCircuit className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary drop-shadow-md sm:text-5xl">
          AI BMI Analyzer
        </h1>
      </div>
      <p className="mt-4 text-center text-lg text-muted-foreground">
        Oblicz swoje BMI i uzyskaj spersonalizowaną analizę od naszego modelu AI.
      </p>
    </header>
  );
}
