"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface StudentFiltersProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string) => void;
  activeFilter: string;
}

export function StudentFilters({
  onSearchChange,
  onFilterChange,
  activeFilter,
}: StudentFiltersProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearchChange(val);
  };

  const filters = [
    { id: "all", label: "Semua Siswa" },
    { id: "active", label: "Aktif" },
    { id: "arrears", label: "Menunggak (SPP)" },
    { id: "graduated", label: "Lulus" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4">
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="rounded-full text-xs h-8"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau NIS..."
          value={searchValue}
          onChange={handleSearch}
          className="pl-8 h-9"
        />
        {searchValue && (
            <button 
                onClick={() => { setSearchValue(''); onSearchChange(''); }}
                className="absolute right-2 top-2.5"
            >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
        )}
      </div>
    </div>
  );
}