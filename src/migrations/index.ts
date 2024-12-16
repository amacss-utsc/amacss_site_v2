import * as migration_20241130_053210_initial_structure from './20241130_053210_initial_structure'
import * as migration_20241216_233548 from './20241216_233548'

export const migrations = [
  {
    up: migration_20241130_053210_initial_structure.up,
    down: migration_20241130_053210_initial_structure.down,
    name: '20241130_053210_initial_structure',
  },
  {
    up: migration_20241216_233548.up,
    down: migration_20241216_233548.down,
    name: '20241216_233548',
  },
]
