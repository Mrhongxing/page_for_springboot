import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: ref(0),
    province: ref(''),
    localpalce: ref([116.397428, 39.90923])
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    provinceName: (state) => state.province,
    localPlace: (state) => state.localpalce
  },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    } 
}
})
