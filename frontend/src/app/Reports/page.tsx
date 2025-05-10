import { Suspense } from "react";
import ReportsClient from "./ReportsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReportsClient />
    </Suspense>
  );
}
