import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      <p className="mt-3 text-sm text-gray-500">Carregando...</p>
    </div>
  );
}
