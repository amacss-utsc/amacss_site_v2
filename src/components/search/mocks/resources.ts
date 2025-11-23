import { type ResourceIndexItem } from "@/components/search/adapters/resources"

export const resourceIndexMock: ResourceIndexItem[] = [
  {
    id: "2025-fall-welcome-workshop",
    title: "Welcome Workshop",
    year: 2025,
    semester: "fall",
    name: "welcome-workshop",
    tokens: ["welcome", "workshop", "fall", "2025"],
    path: "2025/fall/welcome-workshop",
  },
  {
    id: "2024-winter-algorithms-review",
    title: "Algorithms Review",
    year: 2024,
    semester: "winter",
    name: "algorithms-review",
    tokens: ["algorithms", "review", "winter", "2024"],
    path: "2024/winter/algorithms-review",
  },
  {
    id: "2023-fall-git-101",
    title: "Git 101",
    year: 2023,
    semester: "fall",
    name: "git-101",
    tokens: ["git", "version control", "101"],
    path: "2023/fall/git-101",
  },
  {
    id: "2025-winter-react-lab",
    title: "React Lab",
    year: 2025,
    semester: "winter",
    name: "react-lab",
    tokens: ["react", "lab", "frontend"],
    path: "2025/winter/react-lab",
  },
  {
    id: "2024-fall-resume-clinic",
    title: "Resume Clinic",
    year: 2024,
    semester: "fall",
    name: "resume-clinic",
    tokens: ["resume", "career", "clinic"],
    path: "2024/fall/resume-clinic",
  },
  {
    id: "2025-fall-git-rebase-deep-dive",
    title:
      "Super Long Workshop Title: Mastering Git Rebase and Interactive Cherry-Pick in Depth",
    year: 2025,
    semester: "fall",
    name: "git-rebase-deep-dive",
    tokens: ["Git", "git", "rebase", "Rebase", "cherry-pick"],
    path: "2025/fall/git-rebase-deep-dive",
  },
]
