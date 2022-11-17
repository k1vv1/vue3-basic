import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'comVal', // id必填，且需要唯一
  state: () => {
    return {
      name: 'czy',
    }
  },
  actions: {
    updateName(name: string) {
      this.name = name
    },
  },
})
