const LinkTitleMap: Record<string, string> = {
  "": "",
  events: "events",
  leaderboard: "leaderboard",
  calendar: "calendar",
  team: "our team",
  resources: "resources",
}

export const PathnameToTitle = (p: string) =>
  LinkTitleMap[p.split("/")[1] || ""]
