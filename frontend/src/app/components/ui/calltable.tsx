import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./table";
import Button from "./button";
import { EyeIcon } from "lucide-react";

interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
}

const calls: Call[] = [
  { id: 1, name: "John Doe", date: "2025-03-25", duration: "5:32" },
  { id: 2, name: "Jane Smith", date: "2025-03-24", duration: "8:15" },
  { id: 3, name: "Bob Johnson", date: "2025-03-23", duration: "12:45" },
];

const CallTable: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [view, setView] = useState<"none" | "transcription" | "report">("none");

  const handleView = (call: Call, type: "transcription" | "report") => {
    setSelectedCall(call);
    setView(type);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{call.name}</TableCell>
              <TableCell>{call.date}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>
                <Button onClick={() => handleView(call, "transcription")}>
                  <EyeIcon className="w-4 h-4" /> Ver Transcripción
                </Button>
                <Button
                  onClick={() => handleView(call, "report")}
                  className="ml-2"
                >
                  <EyeIcon className="w-4 h-4" /> Ver Reporte
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedCall && view !== "none" && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">
            {view === "transcription"
              ? "Transcripción de la llamada"
              : "Reporte de la llamada"}
          </h3>
          <p className="mt-2 text-gray-700">
            Información de {selectedCall.name}.
          </p>
        </div>
      )}
    </div>
  );
};

export default CallTable;
