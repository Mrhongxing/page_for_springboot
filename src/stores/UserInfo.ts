import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    name: '',
    email: '',
    phone: '',
    role: 1,
    token: '',
    car_type: '',
    car_brand: ''
  }),
  getters: {
    userInfo: (state) => ({
        ...state
    })
  },
  actions: {
    setUserInfo(userInfo: {
      name: string,
      email: string,
      phone: string,
      role: number,
      token: string,
      car_type: string,
      car_brand: string
    }) {
      this.name = userInfo.name
      this.email = userInfo.email
      this.phone = userInfo.phone
      this.role = userInfo.role
      this.token = userInfo.token
      this.car_type = userInfo.car_type
      this.car_brand = userInfo.car_brand
    },
    clearUserInfo() {
      this.name = ''
      this.email = ''
      this.phone = ''
      this.role = 1
      this.car_brand = ''
      this.car_type = ''
      this.token = ''
    }
  },
  // 添加持久化配置
  persist: {
    key: 'user-info-storage',  // 自定义存储的key
    storage: localStorage,      // 使用 localStorage
    pick: ['name', 'email', 'phone', 'role', 'token', 'car_type', 'car_brand'] // 指定需要持久化的字段
  }
})