import * as migration_20241005_201938 from './20241005_201938'
import * as migration_20241006_010803 from './20241006_010803'
import * as migration_20241009_232859 from './20241009_232859'
import * as migration_20241006_214318_events from './20241006_214318_events'
import * as migration_20241011_202828_event_tag from './20241011_202828_event_tag'
import * as migration_20241011_224444 from './20241011_224444'
import * as migration_20241016_152348_ribbon_tag from './20241016_152348_ribbon_tag'
import * as migration_20241016_153512 from './20241016_153512'

export const migrations = [
  {
    up: migration_20241005_201938.up,
    down: migration_20241005_201938.down,
    name: '20241005_201938',
  },
  {
    up: migration_20241006_010803.up,
    down: migration_20241006_010803.down,
    name: '20241006_010803',
  },
  {
    up: migration_20241009_232859.up,
    down: migration_20241009_232859.down,
    name: '20241009_232859',
  },
  {
    up: migration_20241006_214318_events.up,
    down: migration_20241006_214318_events.down,
    name: '20241006_214318_events',
  },
  {
    up: migration_20241011_202828_event_tag.up,
    down: migration_20241011_202828_event_tag.down,
    name: '20241011_202828_event_tag',
  },
  {
    up: migration_20241011_224444.up,
    down: migration_20241011_224444.down,
    name: '20241011_224444',
  },
  {
    up: migration_20241016_152348_ribbon_tag.up,
    down: migration_20241016_152348_ribbon_tag.down,
    name: '20241016_152348_ribbon_tag',
  },
  {
    up: migration_20241016_153512.up,
    down: migration_20241016_153512.down,
    name: '20241016_153512',
  },
]
