import { getCurrentInstance } from 'vue'

export default function useGetGlobalProperties() {
  const instance = getCurrentInstance()
  const globalProperties = instance?.appContext.config.globalProperties
  return {
    ...globalProperties,
  }
}
