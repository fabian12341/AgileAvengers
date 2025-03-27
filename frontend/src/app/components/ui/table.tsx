// components/Table.tsx
import React from "react";

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full bg-gray-900 text-white">{children}</table>
    </div>
  );
};

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <thead className="bg-gray-800">{children}</thead>;

export const TableBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <tbody>{children}</tbody>;

export const TableRow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <tr className="border-b border-gray-700">{children}</tr>;

export const TableHead: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <th className="py-3 px-6 text-left font-medium">{children}</th>;

export const TableCell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <td className="py-3 px-6">{children}</td>;
