import type { PersistedStateOptions } from 'pinia-plugin-persistedstate'

const piniaPersistConfig = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: window.localStorage,
    paths,
  }
  return persist
}

export default piniaPersistConfig
