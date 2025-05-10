import { Suspense } from "react";
import UploadClient from "./UploadClient";

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="text-white p-6">Cargando...</div>}>
      <UploadClient />
    </Suspense>
  );
}
