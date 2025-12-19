import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    user_id: 0,
    email: '',
    petName: '',
    phone:'',
    userImg:'',
    carVin:'',
    carType:'',
    userRole:0,
    token:'',
  }),
  getters: {
    userInfo: (state) => ({
        user_id: state.user_id,
        email:state.email,
        petName:state.petName,
        phone:state.phone,
        userImg:state.userImg,
        carVin:state.carVin,
        carType:state.carType,
        userRole:state.userRole,
        token:state.token,
    })
  },
  actions: {
    setUserInfo(userInfo: {
      user_id: number,
      email: string,
      petName: string,
      phone:string,
      userImg:string,
      carVin:string,
      carType:string,
      userRole:number,
      token:string,
    }) {
    this.user_id = userInfo.user_id
    this.email = userInfo.email
    this.petName = userInfo.petName
    this.phone = userInfo.phone
    this.userImg = userInfo.userImg
    this.carVin = userInfo.carVin
    this.carType = userInfo.carType
    this.userRole = userInfo.userRole
    this.token = userInfo.token 
    },
    clearUserInfo() {
      this.user_id = 0
      this.email = ''
      this.petName = ''
      this.phone = ''
      this.userImg = ''
      this.carVin = ''
      this.carType = ''
      this.userRole = 0
      this.token = ''
    }
  }
})  