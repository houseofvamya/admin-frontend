import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyState?: React.ReactNode;
  getRowKey?: (row: T, index: number) => React.Key;
  onRowClick?: (row: T) => void;
  className?: string;
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  emptyState,
  getRowKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead key={column.key} className={column.headerClassName}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Skeleton className="h-4 w-full max-w-[10rem]" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="py-12 text-center">
              {emptyState ?? <span className="text-charcoal-soft">No results found.</span>}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={getRowKey ? getRowKey(row, index) : index}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export { DataTable };
