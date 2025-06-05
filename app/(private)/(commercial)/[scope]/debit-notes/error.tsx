'use client';

import { Button } from "@/components/ui/button";
import { useErrorReport } from "@/hooks/use-report-error";
import { ArrowLeft, Bomb } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({ error }: { error: Error }) {
  const router = useRouter()

  useErrorReport({ error, fnLocation: 'Error' });

  return (
    <div className="flex flex-col gap-4 items-center col-span-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-destructive/10 p-3 rounded-full shadow-lg shadow-destructive/10">
        <Bomb className="w-6 h-6 text-red-900" />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-md font-medium tracking-tight text-center">
          Ocurrió un error inesperado
        </h1>
        <p className="text-muted-foreground text-xs">
          Registramos el error y lo estamos investigando. Por favor, intenta más tarde.
        </p>
        <span className="text-muted-foreground text-xs">
          (Error: {error.name})
        </span>
      </div>
      <Button
        size="sm"
        variant="link"
        className="text-black"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        Volver
      </Button>
    </div>
  );
}
