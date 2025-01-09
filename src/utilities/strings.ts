const LinkTitleMap: Record<string, string> = {
  "": "",
  events: "events",
  team: "our team",
}

export const PathnameToTitle = (p: string) =>
  LinkTitleMap[p.split("/")[1] || ""]
