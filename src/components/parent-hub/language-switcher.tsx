"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mt-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition text-neutral-700 hover:bg-[color:var(--mec-grey)]"
      >
        <span className="flex items-center gap-3">
          <Globe className="h-4 w-4" /> Language
        </span>
        <span className="text-xs font-bold bg-mec-blue/10 text-mec-blue px-2 py-0.5 rounded-full">{language === "en" ? "EN" : "ID"}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-full origin-bottom overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setLanguage("en");
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-neutral-50 transition-colors ${language === "en" ? "text-mec-blue bg-blue-50/50" : "text-neutral-700"}`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage("id");
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-neutral-50 transition-colors ${language === "id" ? "text-mec-blue bg-blue-50/50" : "text-neutral-700"}`}
            >
              Indonesia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
