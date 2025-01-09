import * as migration_20250104_222122_initial_collections from "./20250104_222122_initial_collections"
import * as migration_20250108_230907_bumblebee_soup from "./20250108_230907_bumblebee_soup"

export const migrations = [
  {
    up: migration_20250104_222122_initial_collections.up,
    down: migration_20250104_222122_initial_collections.down,
    name: "20250104_222122_initial_collections",
  },
  {
    up: migration_20250108_230907_bumblebee_soup.up,
    down: migration_20250108_230907_bumblebee_soup.down,
    name: "20250108_230907_bumblebee_soup",
  },
]
