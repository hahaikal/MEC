"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { updateClassSchedule } from "@/actions/classes";
import { toast } from "sonner";
import { PRESCHOOL_SCHEDULE } from "@/lib/parent-hub-data";

interface WeeklyScheduleEditorProps {
  classId: string;
  initialSchedule: any;
}

export function WeeklyScheduleEditor({ classId, initialSchedule }: WeeklyScheduleEditorProps) {
  const [schedule, setSchedule] = useState<any[]>(
    Array.isArray(initialSchedule) && initialSchedule.length > 0
      ? initialSchedule
      : PRESCHOOL_SCHEDULE // Fallback to default if empty
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[rowIndex] = { ...newSchedule[rowIndex], [field]: value };
    setSchedule(newSchedule);
  };

  const handleAddRow = () => {
    setSchedule([
      ...schedule,
      {
        time: "New Time",
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
      },
    ]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    const newSchedule = schedule.filter((_, i) => i !== rowIndex);
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateClassSchedule(classId, schedule);
      if (result.error) {
        throw new Error(result.error);
      }
      toast.success("Weekly schedule updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update schedule");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 text-neutral-900 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold min-w-[140px]">Time</th>
              <th className="px-4 py-3 font-semibold min-w-[120px]">Monday</th>
              <th className="px-4 py-3 font-semibold min-w-[120px]">Tuesday</th>
              <th className="px-4 py-3 font-semibold min-w-[120px]">Wednesday</th>
              <th className="px-4 py-3 font-semibold min-w-[120px]">Thursday</th>
              <th className="px-4 py-3 font-semibold min-w-[120px]">Friday</th>
              <th className="px-4 py-3 font-semibold w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {schedule.map((row, i) => (
              <tr key={i} className="group hover:bg-neutral-50/50">
                <td className="p-2">
                  <Input
                    value={row.time}
                    onChange={(e) => handleCellChange(i, "time", e.target.value)}
                    className="h-9"
                    placeholder="e.g. 08:00 - 08:30"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.Monday}
                    onChange={(e) => handleCellChange(i, "Monday", e.target.value)}
                    className="h-9"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.Tuesday}
                    onChange={(e) => handleCellChange(i, "Tuesday", e.target.value)}
                    className="h-9"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.Wednesday}
                    onChange={(e) => handleCellChange(i, "Wednesday", e.target.value)}
                    className="h-9"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.Thursday}
                    onChange={(e) => handleCellChange(i, "Thursday", e.target.value)}
                    className="h-9"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={row.Friday}
                    onChange={(e) => handleCellChange(i, "Friday", e.target.value)}
                    className="h-9"
                  />
                </td>
                <td className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveRow(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleAddRow} className="text-neutral-600">
          <Plus className="mr-2 h-4 w-4" /> Add Row
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[color:var(--mec-blue)] hover:bg-[color:var(--mec-blue)]/90">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Schedule
        </Button>
      </div>
    </div>
  );
}
