import * as migration_20241006_205900_events from './20241006_205900_events'
import * as migration_20241006_213931_events from './20241006_213931_events'
import * as migration_20241006_214318_events from './20241006_214318_events'
import * as migration_20241011_202543_event_tag from './20241011_202543_event_tag'
import * as migration_20241011_202828_event_tag from './20241011_202828_event_tag'
import * as migration_20241011_224444 from './20241011_224444'

export const migrations = [
  {
    up: migration_20241006_205900_events.up,
    down: migration_20241006_205900_events.down,
    name: '20241006_205900_events',
  },
  {
    up: migration_20241006_213931_events.up,
    down: migration_20241006_213931_events.down,
    name: '20241006_213931_events',
  },
  {
    up: migration_20241006_214318_events.up,
    down: migration_20241006_214318_events.down,
    name: '20241006_214318_events',
  },
  {
    up: migration_20241011_202543_event_tag.up,
    down: migration_20241011_202543_event_tag.down,
    name: '20241011_202543_event_tag',
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
]
