import * as migration_20261031_023007_initial from './20261031_023007_initial'
import * as migration_20261031_023100_search_indexes from './20261031_023100_search_indexes'

export const migrations = [
  {
    up: migration_20261031_023007_initial.up,
    down: migration_20261031_023007_initial.down,
    name: '20261031_023007_initial',
  },
  {
    up: migration_20261031_023100_search_indexes.up,
    down: migration_20261031_023100_search_indexes.down,
    name: '20261031_023100_search_indexes',
  },
]
