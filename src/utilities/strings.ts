const LinkTitleMap: Record<string, string> = {
  "": "",
  events: "events",
  team: "our team",
  resources: "resources",
}

export const PathnameToTitle = (p: string) =>
  LinkTitleMap[p.split("/")[1] || ""]
