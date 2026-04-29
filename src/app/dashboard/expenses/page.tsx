'use client'

import React, { useState } from 'react'
import { ExpensesList } from './_components/expenses-list'
import { AddExpenseDialog } from './_components/add-expense-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, FilterX } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'

export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [category, setCategory] = useState<string>('all')

  const resetFilters = () => {
    setDateRange(undefined)
    setCategory('all')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengeluaran</h1>
          <p className="text-muted-foreground">
            Catat dan pantau pengeluaran operasional sekolah.
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border shadow-sm overflow-x-auto w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto min-w-max">
           {/* Date Range Picker */}
           <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: idLocale })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: idLocale })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: idLocale })
                    )
                  ) : (
                    <span>Pilih Tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="operational">Operasional</SelectItem>
              <SelectItem value="salary">Gaji</SelectItem>
              <SelectItem value="asset">Aset</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(dateRange || category !== 'all') && (
          <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">
            <FilterX className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        )}
      </div>

      <ExpensesList
        filters={{
          startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
          category: category
        }}
      />
    </div>
  )
}
