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

const kidsImg = (seed: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PHOTOS = [
  "1503676260728-1c00da094a0b",
  "1427504494785-3a9ca7044f45",
  "1497633762265-9d179a990aa6",
  "1509062522246-3755977927d7",
  "1588072432836-e10032774350",
  "1571260899304-425eee4c7efc",
  "1517486808906-6ca8b3f04846",
  "1580582932707-520aed937b7b",
  "1546410531-bb4caa6b424d",
  "1488521787991-ed7bbaae773c",
  "1564429097439-e4ffa3a3ab16",
  "1610484826967-09c5720778c7",
];

const photo = (i: number, w = 800, h = 600) =>
  kidsImg(PHOTOS[i % PHOTOS.length], w, h);

const portrait = (i: number) =>
  `https://i.pravatar.cc/400?img=${(i % 70) + 1}`;

export const BG_CLASSROOM = photo(0, 1920, 1280);

function mkGallery(prefix: string, count: number, base = 0): GalleryItem[] {
  const statuses: Status[] = ["past", "ongoing", "upcoming"];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-g-${i}`,
    title: `${prefix} Activity ${i + 1}`,
    description:
      "Fun activities with students: interactive learning, role-playing, and weekly thematic explorations.",
    image: photo(base + i + 1),
    date: `${10 + i} ${["Jan", "Feb", "Mar", "Apr"][i % 4]} 2026`,
    status: statuses[i % 3],
  }));
}

const englishTeachers: Teacher[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `eng-t-${i}`,
  name: [
    "Ms. Sarah Kim",
    "Mr. Adam Howell",
    "Ms. Emma Turner",
    "Mr. Mark Johnson",
    "Ms. Pamela Anderson",
    "Mr. David Lee",
    "Ms. Olivia Chen",
    "Mr. Ethan Brooks",
    "Ms. Chloe Davis",
  ][i],
  role: "English Teacher",
  image: portrait(i + 10),
  specialties: ["Speaking", "Reading & Writing", "Grammar Mastery"],
  bio: "Experienced teacher with high dedication to helping students master English confidently.",
}));

export const PROGRAMS: Record<string, ProgramInfo> = {
  "english-class": {
    slug: "english-class",
    name: "English Class",
    description:
      "Our flagship English program for all ages, guided by our professional teachers.",
    teachers: englishTeachers,
    gallery: mkGallery("English", 9, 0),
  },
  bimbel: {
    slug: "bimbel",
    name: "Tutoring (Bimbel)",
    description:
      "Structured tutoring to support children's academic achievements at school.",
    teachers: [
      {
        id: "bim-t-1",
        name: "Ms. Rina Pratiwi",
        role: "Tutoring Coordinator",
        image: portrait(25),
        specialties: ["Math", "Science", "Social Studies"],
        bio: "Tutoring specialist for elementary and middle school students with a personalized approach.",
      },
    ],
    gallery: mkGallery("Tutoring", 6, 2),
  },
  calistung: {
    slug: "calistung",
    name: "Reading, Writing & Counting",
    description:
      "Reading, writing, and counting program for early childhood using fun methods.",
    teachers: [
      {
        id: "cal-t-1",
        name: "Ms. Dewi Lestari",
        role: "Early Literacy Specialist",
        image: portrait(35),
        specialties: ["Reading", "Writing", "Counting"],
        bio: "Helping children develop fundamental literacy and numeracy skills.",
      },
    ],
    gallery: mkGallery("Literacy", 6, 4),
  },
};

export const CLASSES = Array.from({ length: 30 }).map((_, i) => {
  const n = i + 1;
  return {
    id: `class-${n}`,
    name: `Class ${n}`,
    teacher: {
      id: `cls-t-${n}`,
      name: englishTeachers[i % englishTeachers.length].name,
      role: `Homeroom Teacher · Class ${n}`,
      image: portrait(i + 1),
      specialties: ["Curriculum", "Mentoring", "Assessment"],
      bio: `Homeroom teacher for Class ${n}, dedicated to every student's development.`,
    } as Teacher,
    gallery: mkGallery(`Class ${n}`, 6, n),
  };
});

export const EVENTS: GalleryItem[] = [
  {
    id: "e1",
    title: "Spelling Bee Championship",
    description: "Annual academy-level spelling competition.",
    image: photo(2),
    date: "5 Jun 2026",
    status: "past",
  },
  {
    id: "e2",
    title: "Parents Open House",
    description: "Face-to-face session between parents and homeroom teachers.",
    image: photo(3),
    date: "20 Jun 2026",
    status: "past",
  },
  {
    id: "e3",
    title: "Summer Camp 2026",
    description: "Summer camping activities with an 'Explorers' theme.",
    image: photo(4),
    date: "23 Jun 2026",
    status: "ongoing",
  },
  {
    id: "e4",
    title: "Story Telling Night",
    description: "Storytelling night with favorite teachers.",
    image: photo(5),
    date: "28 Jun 2026",
    status: "upcoming",
  },
  {
    id: "e5",
    title: "Graduation Day",
    description: "Graduation celebration for Preschool & English Class students.",
    image: photo(6),
    date: "10 Jul 2026",
    status: "upcoming",
  },
  {
    id: "e6",
    title: "Art & Craft Festival",
    description: "Exhibition of our students' artworks.",
    image: photo(7),
    date: "18 Jul 2026",
    status: "upcoming",
  },
];

export const PRESCHOOL_TEACHERS: Teacher[] = Array.from({ length: 4 }).map(
  (_, i) => ({
    id: `pre-t-${i}`,
    name: ["Ms. Anita", "Ms. Bella", "Ms. Cindy", "Ms. Diana"][i],
    role: "Preschool Teacher",
    image: portrait(40 + i),
    specialties: ["Storytelling", "P.E.", "Music"],
  })
);

export const PRESCHOOL_SCHEDULE = [
  {
    time: "09:00 AM",
    Monday: "Circle Time",
    Tuesday: "Free Play",
    Wednesday: "P.E.",
    Thursday: "Music & Move",
    Friday: "Story Time",
  },
  {
    time: "09:30 AM",
    Monday: "Phonics",
    Tuesday: "Math Fun",
    Wednesday: "Snack Time",
    Thursday: "Art & Craft",
    Friday: "Show & Tell",
  },
  {
    time: "10:00 AM",
    Monday: "Snack Time",
    Tuesday: "Snack Time",
    Wednesday: "Science Fun",
    Thursday: "Snack Time",
    Friday: "Snack Time",
  },
  {
    time: "10:30 AM",
    Monday: "Music & Move",
    Tuesday: "Art & Craft",
    Wednesday: "Free Play",
    Thursday: "Story Time",
    Friday: "Farewell",
  },
];

export const PRESCHOOL_GALLERY = mkGallery("Preschool", 8, 6);

export const PRESCHOOL_MAGAZINES: MagazineItem[] = [
  {
    id: "mag-1",
    title: "MEC Little Explorers",
    issue: "July 2026 Issue",
    coverImage: photo(8, 400, 560),
    pdfUrl: "#",
    date: "1 Jul 2026",
  },
  {
    id: "mag-2",
    title: "MEC Little Explorers",
    issue: "June 2026 Issue",
    coverImage: photo(9, 400, 560),
    pdfUrl: "#",
    date: "1 Jun 2026",
  },
  {
    id: "mag-3",
    title: "MEC Little Explorers",
    issue: "May 2026 Issue",
    coverImage: photo(10, 400, 560),
    pdfUrl: "#",
    date: "1 May 2026",
  },
];

export const DASHBOARD_ACTIVITIES = [
  ...EVENTS,
  ...PROGRAMS["english-class"].gallery.slice(0, 3),
];
