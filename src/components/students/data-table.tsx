"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchElement?: React.ReactNode;
  filterElements?: React.ReactNode;
  yearFilterElement?: React.ReactNode;
  year?: number;
}

// Helper to determine row color based on student data completeness
function getRowColorClass(data: any) {
  if (!data) return "";

  // If student is INACTIVE, return light red background
  if (data.status === 'INACTIVE' || data.status === 'inactive') {
    return "bg-red-100 hover:bg-red-100/50";
  }

  const hasName = !!data.name && data.name.trim() !== "";
  const hasClass = !!data.class_name && data.class_name.trim() !== "";
  const hasFee = data.base_fee !== undefined && data.base_fee !== null && data.base_fee > 0;
  const hasGender = !!data.gender && data.gender.trim() !== "";

  // Cek field lainnya untuk kelengkapan penuh (Hijau)
  const isComplete =
    hasName && hasClass && hasFee && hasGender &&
    !!data.phone_number && data.phone_number.trim() !== "" &&
    (!!data.father_name && data.father_name.trim() !== "" || !!data.mother_name && data.mother_name.trim() !== "") &&
    !!data.address && data.address.trim() !== "" &&
    !!data.date_of_birth && data.date_of_birth.trim() !== "" &&
    !!data.place_of_birth && data.place_of_birth.trim() !== "" &&
    !!data.religion && data.religion.trim() !== "";

  if (isComplete) {
    return "bg-green-100 hover:bg-green-100/50";
  }

  // Kuning: Field utama terisi, tapi field pendukung ada yang kosong
  return "bg-yellow-100 hover:bg-yellow-100/50";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchElement,
  filterElements,
  yearFilterElement,
  year,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('student-table-columns')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return {}
        }
      }
    }
    return {}
  })

  React.useEffect(() => {
    localStorage.setItem('student-table-columns', JSON.stringify(columnVisibility))
  }, [columnVisibility])
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      selectedYear: year,
    },
  });

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col py-2 px-1 gap-3">
        {/* Row 1: Search Element and Year Filter */}
        <div className="flex flex-col sm:flex-row w-full items-center gap-3">
          {searchElement && (
            <div className="w-full sm:w-auto">
              {searchElement}
            </div>
          )}
          {yearFilterElement && (
            <div className="w-full sm:w-[120px]">
              {yearFilterElement}
            </div>
          )}
        </div>
        
        {/* Row 2: Filters and Columns */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {filterElements}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-9">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(e) => e.preventDefault()}
                      >
                        {column.id === 'name' ? 'Nama' : 
                         column.id === 'nis' ? 'NIS' : 
                         column.id === 'school' ? 'Sekolah' : 
                         column.id === 'status' ? 'Status' : 
                         column.id === 'phone_parent' ? 'No. HP Ortu' :
                         column.id === 'classes' ? 'Kelas' :
                         column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Table Container with Scroll Area for horizontal scrolling */}
      <div className="rounded-md border bg-white flex-1 relative flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 w-full whitespace-nowrap">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-xs font-bold text-foreground/70">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn("group", getRowColorClass(row.original))}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}