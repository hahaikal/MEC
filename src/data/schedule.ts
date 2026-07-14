export type ClassColor = "mint" | "lavender" | "sky" | "peach" | "butter" | "rose";

export interface ClassSchedule {
  name: string;
  time: string;
  teacher: string;
  students: string[];
  color: ClassColor;
}

export interface ScheduleGroup {
  title: string;
  days: string;
  classes: ClassSchedule[];
}

export const colorOptions: ClassColor[] = [
  "mint",
  "lavender",
  "sky",
  "peach",
  "butter",
  "rose",
];

const daysMap: Record<string, string> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

const dayOrder: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export function mapClassesToScheduleGroups(classes: any[]): ScheduleGroup[] {
  if (!classes || classes.length === 0) return [];

  const groupsRecord: Record<string, ClassSchedule[]> = {};

  classes.forEach((c, i) => {
    if (!c.schedule_days || c.schedule_days.length === 0) return;

    // Sort days first to prevent duplicate groups like "Selasa, Kamis" vs "Kamis, Selasa"
    const sortedDays = [...c.schedule_days].sort(
      (a: string, b: string) => (dayOrder[a] || 99) - (dayOrder[b] || 99)
    );

    const daysStr = sortedDays
      .map((d: string) => daysMap[d] || d)
      .join(", ");

    const groupKey = daysStr;

    if (!groupsRecord[groupKey]) {
      groupsRecord[groupKey] = [];
    }

    const teacherName =
      c.teachers && c.teachers.length > 0
        ? c.teachers.map((t: any) => t.full_name || t.email).join(", ")
        : "No Teacher";

    const studentsArr = Array.isArray(c.students) && c.students.length > 0 
      ? c.students 
      : [];

    const color = colorOptions[i % colorOptions.length];

    groupsRecord[groupKey].push({
      name: c.name,
      time: c.schedule_time || "TBA",
      teacher: teacherName,
      students: studentsArr,
      color,
    });
  });

  // Sort classes inside groups by time
  Object.keys(groupsRecord).forEach(key => {
    groupsRecord[key].sort((a, b) => {
      if (a.time === "TBA") return 1;
      if (b.time === "TBA") return -1;
      return a.time.localeCompare(b.time);
    });
  });

  const result: ScheduleGroup[] = Object.keys(groupsRecord).map((key) => ({
    title: "Jadwal Kelas",
    days: key,
    classes: groupsRecord[key],
  }));

  // Sort groups if needed, but for now just return them
  return result;
}
