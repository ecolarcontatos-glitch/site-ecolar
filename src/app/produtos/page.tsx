import { Suspense } from "react";
import ProdutosPageContent from "./ProdutosPageContent";

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[#6b7280]">Carregando produtos...</div>}>
      <ProdutosPageContent />
    </Suspense>
  );
}