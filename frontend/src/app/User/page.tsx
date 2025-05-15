import React, { Suspense } from "react";
import Dashboard from "../components/UserProfile"; // o la ruta que uses

export default function UserPage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Cargando dashboard...</div>}>
      <Dashboard />
    </Suspense>
  );
}
