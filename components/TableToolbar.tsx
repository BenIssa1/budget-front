import { Input } from "@/components/ui/input";
import React from "react";
import type { Table } from "@tanstack/react-table";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  filterColumn?: string;
  actionComponent?: React.ReactNode;
}

export function TableToolbar<TData>({
  table,
  placeholder = "Filtrer...",
  filterColumn = "label",
  actionComponent,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder={placeholder}
        value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(filterColumn)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      {actionComponent}
    </div>
  );
}
