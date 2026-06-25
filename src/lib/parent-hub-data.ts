export type Status = "upcoming" | "ongoing" | "past";

export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties?: string[];
  bio?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  status: Status;
}

export interface MagazineItem {
  id: string;
  title: string;
  issue: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
}

export interface ProgramInfo {
  slug: string;
  name: string;
  description: string;
  teachers: Teacher[];
  gallery: GalleryItem[];
}

export const BG_CLASSROOM = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&h=1280&q=80";

export const PRESCHOOL_SCHEDULE: Array<{
  time: string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
}> = [
  {
    time: "08:00 - 08:30",
    Monday: "Arrival & Free Play",
    Tuesday: "Arrival & Free Play",
    Wednesday: "Arrival & Free Play",
    Thursday: "Arrival & Free Play",
    Friday: "Arrival & Free Play",
  },
  {
    time: "08:30 - 09:00",
    Monday: "Morning Circle",
    Tuesday: "Morning Circle",
    Wednesday: "Morning Circle",
    Thursday: "Morning Circle",
    Friday: "Morning Circle",
  },
  {
    time: "09:00 - 09:45",
    Monday: "Language & Literacy",
    Tuesday: "Math & Logic",
    Wednesday: "Arts & Crafts",
    Thursday: "Science Discovery",
    Friday: "Music & Movement",
  },
  {
    time: "09:45 - 10:15",
    Monday: "Snack Time",
    Tuesday: "Snack Time",
    Wednesday: "Snack Time",
    Thursday: "Snack Time",
    Friday: "Snack Time",
  },
  {
    time: "10:15 - 11:00",
    Monday: "Outdoor Play",
    Tuesday: "Outdoor Play",
    Wednesday: "Outdoor Play",
    Thursday: "Outdoor Play",
    Friday: "Outdoor Play",
  },
  {
    time: "11:00 - 11:30",
    Monday: "Story Time & Dismissal",
    Tuesday: "Story Time & Dismissal",
    Wednesday: "Story Time & Dismissal",
    Thursday: "Story Time & Dismissal",
    Friday: "Show & Tell & Dismissal",
  },
];
