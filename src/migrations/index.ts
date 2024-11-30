import * as migration_20241130_053210_initial_structure from './20241130_053210_initial_structure'

export const migrations = [
  {
    up: migration_20241130_053210_initial_structure.up,
    down: migration_20241130_053210_initial_structure.down,
    name: '20241130_053210_initial_structure',
  },
]
