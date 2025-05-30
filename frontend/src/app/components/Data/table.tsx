import React from "react";

export const Table: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`border rounded-lg overflow-auto ${className || ""}`}
    {...props}
  >
    <table className="min-w-full bg-gray-900 text-white">{children}</table>
  </div>
);

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => (
  <thead className={`bg-gray-800 ${className || ""}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => (
  <tbody className={className} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => (
  <tr className={`border-b border-gray-700 ${className || ""}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => (
  <th
    className={`py-3 px-6 text-left font-medium ${className || ""}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => (
  <td className={`py-3 px-6 ${className || ""}`} {...props}>
    {children}
  </td>
);
