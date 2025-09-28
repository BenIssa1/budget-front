"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTablePagination } from "./data-table-pagination"
import { TableToolbar } from "@/components/TableToolbar" // <-- importe le composant

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  length?: number
  toolbarActionComponent?: React.ReactNode // <-- nouvelle prop
  filterColumn?: string // <-- pour personnaliser la colonne filtrée
  placeholder?: string // <-- placeholder du filtre
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  length = 5,
  toolbarActionComponent,
  filterColumn = "label",
  placeholder = "Filtrer par libellé..."
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      {/* 🔥 Intégration de la barre de filtre et action */}
      <TableToolbar
        table={table}
        filterColumn={filterColumn}
        placeholder={placeholder}
        actionComponent={toolbarActionComponent}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {table.getAllColumns().map((column, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`} className="text-sm text-left max-w-[150px]">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune donnée disponible pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
