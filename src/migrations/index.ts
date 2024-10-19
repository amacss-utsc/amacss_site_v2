import * as migration_20241005_201938 from './20241005_201938';
import * as migration_20241006_010803 from './20241006_010803';
import * as migration_20241009_232859 from './20241009_232859';
import * as migration_20241019_150404 from './20241019_150404';

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
    up: migration_20241019_150404.up,
    down: migration_20241019_150404.down,
    name: '20241019_150404'
  },
];
