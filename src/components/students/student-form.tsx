"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormValues } from "@/lib/validators/student";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DatePickerWithYearNavProps {
  date?: Date;
  onSelect: (date: Date) => void;
}

function DatePickerWithYearNav({ date, onSelect }: DatePickerWithYearNavProps) {
  const [selectedYear, setSelectedYear] = useState(date?.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date?.getMonth() || new Date().getMonth());
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthSelect = (day: number) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    onSelect(newDate);
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) => currentYear - 80 + i).reverse();

  return (
    <div className="p-3 space-y-2 w-80">
      {/* Year Navigator - Compact */}
      <div className="space-y-1">
        <label className="text-xs font-medium">Tahun</label>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedYear(selectedYear - 10)}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Select value={selectedYear.toString()} onValueChange={(v) => handleYearChange(parseInt(v))}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="h-48">
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedYear(selectedYear + 10)}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Month Navigator - Compact */}
      <div className="space-y-1">
        <label className="text-xs font-medium">Bulan</label>
        <div className="grid grid-cols-4 gap-1">
          {monthNames.map((month, index) => (
            <Button
              key={month}
              variant={selectedMonth === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(index)}
              className="text-xs h-7 p-1"
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar - Compact */}
      <div className="space-y-1">
        <label className="text-xs font-medium">
          {monthNames[selectedMonth]} {selectedYear}
        </label>
        <div className="grid grid-cols-7 gap-0.5">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div key={day} className="text-center text-xs font-medium h-6 flex items-center justify-center">
              {day.slice(0, 1)}
            </div>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleMonthSelect(day)}
              disabled={!day}
              className={cn(
                "h-6 w-6 rounded text-xs transition-colors",
                !day && "invisible",
                day && "hover:bg-accent cursor-pointer",
                date && date.getDate() === day && date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
                  ? "bg-primary text-primary-foreground font-semibold"
                  : ""
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StudentFormProps {
  defaultValues?: Partial<StudentFormValues>;
  onSubmit: (values: StudentFormValues) => void;
  isLoading?: boolean;
}

export function StudentForm({ defaultValues, onSubmit, isLoading }: StudentFormProps) {
  // PERBAIKAN: Inisialisasi semua field dengan string kosong agar tidak undefined
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nis: "",
      name: "",
      email: "",
      phone_number: "",
      parent_name: "",
      parent_phone: "",
      address: "",
      class_year: "",
      status: "ACTIVE",
      billing_cycle_date: 10,
      base_fee: 0,
      // Timpa dengan defaultValues dari props (untuk kasus Edit)
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informasi Dasar */}
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="text-sm font-bold uppercase tracking-wide">Data Siswa</h3>
            </div>
            
            <FormField
              control={form.control}
              name="nis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIS</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor Induk Siswa" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Siswa" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif</SelectItem>
                      <SelectItem value="GRADUATED">Lulus</SelectItem>
                      <SelectItem value="DROPOUT">Keluar (DO)</SelectItem>
                      <SelectItem value="ON_LEAVE">Cuti</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd MMMM yyyy")
                          ) : (
                            <span>Pilih tanggal lahir</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePickerWithYearNav
                        date={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Pastikan tahun lahir akurat untuk perhitungan umur yang tepat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Informasi Orang Tua */}
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="text-sm font-bold uppercase tracking-wide">Data Orang Tua</h3>
            </div>
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Orang Tua / Wali</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Orang Tua" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP Orang Tua</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Alamat lengkap..." 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Informasi Keuangan */}
        <div className="space-y-4 pt-4">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="text-sm font-bold uppercase tracking-wide">Pengaturan Pembayaran</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Biaya Dasar SPP (Rp)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="billing_cycle_date"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tanggal Tagihan (1-28)</FormLabel>
                    <FormControl>
                        <Input type="number" min={1} max={28} {...field} />
                    </FormControl>
                    <FormDescription>Tanggal jatuh tempo SPP setiap bulan.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Data
          </Button>
        </div>
      </form>
    </Form>
  );
}
