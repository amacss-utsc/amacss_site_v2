import * as migration_20250104_222122_initial_collections from "./20250104_222122_initial_collections"
import * as migration_20250108_230907_club_members from "./20250108_230907_club_members"
import * as migration_20250121_010901_additional_fields from "./20250121_010901_additional_fields"
import * as migration_20250201_230502_resources from "./20250201_230502_resources"
import * as migration_20250202_202832_on_sidebar_attribute from "./20250202_202832_on_sidebar_attribute"

export const migrations = [
  {
    up: migration_20250104_222122_initial_collections.up,
    down: migration_20250104_222122_initial_collections.down,
    name: "20250104_222122_initial_collections",
  },
  {
    up: migration_20250108_230907_club_members.up,
    down: migration_20250108_230907_club_members.down,
    name: "20250108_230907_club_members",
  },
  {
    up: migration_20250121_010901_additional_fields.up,
    down: migration_20250121_010901_additional_fields.down,
    name: "20250121_010901_additional_fields",
  },
  {
    up: migration_20250201_230502_resources.up,
    down: migration_20250201_230502_resources.down,
    name: "20250201_230502_resources",
  },
  {
    up: migration_20250202_202832_on_sidebar_attribute.up,
    down: migration_20250202_202832_on_sidebar_attribute.down,
    name: "20250202_202832_on_sidebar_attribute",
  },
]
