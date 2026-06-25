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
}> = [];
