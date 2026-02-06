"use client";

import { useState, useMemo } from "react";
import { StudentFilters } from "./student-filters";
// Menggunakan komponen matrix table yang sudah ada
import { TuitionMatrixTable } from "./tuition-matrix-table"; 

interface StudentsClientWrapperProps {
  initialData: any[];
}

export function StudentsClientWrapper({ initialData }: StudentsClientWrapperProps) {
  const [filterType, setFilterType] = useState("active"); // Default ke Active saja biar bersih
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    let data = [...initialData];

    // 1. Apply Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(lowerQuery) ||
          s.nis?.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Apply Type Filter
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    switch (filterType) {
      case "active":
        data = data.filter((s) => s.status === "ACTIVE" || s.status === "active");
        break;
      case "graduated":
        data = data.filter((s) => s.status === "GRADUATED");
        break;
      case "arrears":
        // Logic: Siswa aktif yang belum bayar SPP bulan ini
        data = data.filter((s) => {
          if (s.status !== "ACTIVE" && s.status !== "active") return false;
          const hasPaid = s.payments?.some((p: any) => {
             if (!p.payment_date) return false;
             const d = new Date(p.payment_date);
             return d.getMonth() === currentMonth && 
                    d.getFullYear() === currentYear && 
                    p.category === 'tuition' &&
                    p.payment_status === 'completed';
          });
          return !hasPaid;
        });
        break;
      default:
        // 'all' - no filter
        break;
    }

    return data;
  }, [initialData, filterType, searchQuery]);

  return (
    <div className="space-y-4">
      <StudentFilters
        activeFilter={filterType}
        onFilterChange={setFilterType}
        onSearchChange={setSearchQuery}
      />
      
      {/* FIX: Mengganti prop 'data' menjadi 'students'. 
         Komponen TuitionMatrixTable kemungkinan besar mengharapkan prop 'students'.
      */}
      <TuitionMatrixTable students={filteredData} />
      
      <div className="text-xs text-muted-foreground text-right">
        Menampilkan {filteredData.length} dari {initialData.length} siswa
      </div>
    </div>
  );
}