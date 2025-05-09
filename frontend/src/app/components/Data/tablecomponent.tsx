import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./table";
import { EyeIcon } from "lucide-react";

interface Call {
  id: number;
  name: string;
  date: string;
  duration: string;
  agent: string;
  onView: (type: "transcription" | "report") => void;
  download?: React.ReactNode;
}

interface TableComponentProps {
  calls: Call[];
}

const TableComponent: React.FC<TableComponentProps> = ({ calls }) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Agente</TableHead>
          <TableHead>Transcript</TableHead>
          <TableHead>Reporte</TableHead>
          <TableHead>Descargar</TableHead>
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
                  selectedCall?.id === call.id && selectedCall.type === "report"
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
                onClick={() => handleClick(call.id, "report", call.onView)}
              />
            </TableCell>
            <TableCell>{call.download || <span className="text-gray-500">-</span>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
