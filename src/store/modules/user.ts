import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '../utils/persist'

interface IUserState {
  firstName: string
  lastName: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const state = reactive<IUserState>({
      firstName: 'Chen',
      lastName: 'Zhiyuan',
    })

    const fullName = (): string => state.firstName + '' + state.lastName

    const updateLastName = (lastName: string) => (state.lastName = lastName)

    return {
      ...toRefs(state),
      fullName,
      updateLastName,
    }
  },
  {
    // 根据配置只持久化lastName
    persist: piniaPersistConfig('user', ['lastName']),
  },
)
