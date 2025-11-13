import { type CourseIndexItem } from "@/components/search/adapters/courses"

export const courseIndexMock: CourseIndexItem[] = [
  {
    id: "mat-a31",
    dept: "mat",
    courseKey: "a31",
    title: "MATA31 — Calculus I",
    tokens: ["mat", "mata31", "a31", "calculus", "calc 1"],
    semesters: [
      { year: 2025, semester: "fall", path: "mat/a31/2025/fall" },
      { year: 2024, semester: "winter", path: "mat/a31/2024/winter" },
    ],
    latest: { year: 2025, semester: "fall", path: "mat/a31/2025/fall" },
  },
  {
    id: "csc-b63",
    dept: "csc",
    courseKey: "b63",
    title: "CSCB63 — Design and Analysis of Data Structures",
    tokens: ["csc", "cscb63", "b63", "data structures", "dsa"],
    semesters: [
      { year: 2024, semester: "winter", path: "csc/b63/2024/winter" },
      { year: 2023, semester: "fall", path: "csc/b63/2023/fall" },
    ],
    latest: { year: 2024, semester: "winter", path: "csc/b63/2024/winter" },
  },
  {
    id: "sta-b57",
    dept: "sta",
    courseKey: "b57",
    title: "STAB57 — Probability and Statistics I",
    tokens: ["sta", "stab57", "b57", "probability", "statistics"],
    semesters: [{ year: 2023, semester: "fall", path: "sta/b57/2023/fall" }],
    latest: { year: 2023, semester: "fall", path: "sta/b57/2023/fall" },
  },
  {
    id: "csc-a08",
    dept: "csc",
    courseKey: "a08",
    title: "CSCA08 — Intro to Computer Science",
    tokens: ["intro", "programming", "python", "csca08", "a08"],
    semesters: [
      { year: 2025, semester: "winter", path: "csc/a08/2025/winter" },
      { year: 2024, semester: "fall", path: "csc/a08/2024/fall" },
    ],
    latest: { year: 2025, semester: "winter", path: "csc/a08/2025/winter" },
  },
  {
    id: "csc-b36",
    dept: "csc",
    courseKey: "b36",
    title: "CSCB36 — Operating Systems",
    tokens: ["os", "threads", "process", "cscb36", "b36"],
    semesters: [{ year: 2024, semester: "fall", path: "csc/b36/2024/fall" }],
    latest: { year: 2024, semester: "fall", path: "csc/b36/2024/fall" },
  },
  {
    id: "mat-b41",
    dept: "mat",
    courseKey: "b41",
    title: "MATB41 — Calculus II",
    tokens: ["calculus 2", "integral", "series", "matb41", "b41"],
    semesters: [{ year: 2025, semester: "fall", path: "mat/b41/2025/fall" }],
    latest: { year: 2025, semester: "fall", path: "mat/b41/2025/fall" },
  },
  {
    id: "csc-c01",
    dept: "csc",
    courseKey: "c01",
    title: "CSCC01 — Software Engineering",
    tokens: ["software", "engineering", "team", "agile", "cscc01"],
    semesters: [
      { year: 2023, semester: "winter", path: "csc/c01/2023/winter" },
    ],
    latest: { year: 2023, semester: "winter", path: "csc/c01/2023/winter" },
  },
  {
    id: "sta-c37",
    dept: "sta",
    courseKey: "c37",
    title: "STAC37 — Statistical Methods",
    tokens: ["anova", "regression", "stac37", "methods"],
    semesters: [
      { year: 2024, semester: "winter", path: "sta/c37/2024/winter" },
    ],
    latest: { year: 2024, semester: "winter", path: "sta/c37/2024/winter" },
  },
  {
    id: "csc-d90",
    dept: "csc",
    courseKey: "d90",
    title:
      "CSCD90 — Advanced Topics in Algorithms and Complexity with a very long descriptive subtitle to test line wrapping and overflow behavior in the list",
    tokens: ["algorithms", "algorithms", "complexity", "advanced", "cscd90"],
    semesters: [{ year: 2025, semester: "fall", path: "csc/d90/2025/fall" }],
    latest: { year: 2025, semester: "fall", path: "csc/d90/2025/fall" },
  },
]
