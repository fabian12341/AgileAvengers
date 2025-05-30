import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./table"; // Asegúrate que estos componentes acepten clases
import { EyeIcon } from "lucide-react";

interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
  agent: string;
  onView: (type: "transcription" | "report") => void;
  download?: React.ReactNode;
  onDelete?: () => void;
  deleteButton?: React.ReactNode;
  role?: string;
}

interface TableComponentProps {
  calls: Call[];
  showDelete?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  calls,
  showDelete,
}) => {
  const [selectedCall, setSelectedCall] = useState<{
    id: number;
    type: "transcription" | "report";
  } | null>(null);

  const handleClick = (
    callId: number,
    type: "transcription" | "report",
    onView: (type: "transcription" | "report") => void
  ) => {
    setSelectedCall({ id: callId, type });
    onView(type);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px]">
        {" "}
        {/* Fuerza que haya scroll horizontal en pantallas pequeñas */}
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Nombre</TableHead>
              <TableHead className="whitespace-nowrap">Fecha</TableHead>
              <TableHead className="whitespace-nowrap">Duración</TableHead>
              <TableHead className="whitespace-nowrap">Agente</TableHead>
              <TableHead className="whitespace-nowrap">Transcript</TableHead>
              <TableHead className="whitespace-nowrap">Reporte</TableHead>
              <TableHead className="whitespace-nowrap">Descargar</TableHead>
              {showDelete && (
                <TableHead className="whitespace-nowrap">Eliminar</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>{call.id}</TableCell>
                <TableCell>{call.name}</TableCell>
                <TableCell>{call.date}</TableCell>
                <TableCell>{call.duration}</TableCell>
                <TableCell>{call.agent}</TableCell>
                <TableCell>
                  <EyeIcon
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      selectedCall?.id === call.id &&
                      selectedCall.type === "transcription"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    onClick={() =>
                      handleClick(call.id, "transcription", call.onView)
                    }
                  />
                </TableCell>
                <TableCell>
                  <EyeIcon
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      selectedCall?.id === call.id &&
                      selectedCall.type === "report"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleClick(call.id, "report", call.onView)}
                  />
                </TableCell>
                <TableCell>
                  {call.download || <span className="text-gray-500">-</span>}
                </TableCell>
                {showDelete && <TableCell>{call.deleteButton}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableComponent;
