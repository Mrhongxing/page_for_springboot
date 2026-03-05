<script setup name="car" lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserInfoStore } from '@/stores/UserInfo';
    import { useNavigationStore } from '@/stores/navigateStore';
    import apiClient from '@/apiClient/apiClient';
    const router = useRouter();
    const userInfoStore = useUserInfoStore();
    let imgurl = "https://ts1.tc.mm.bing.net/th/id/R-C.462b0671d07d9b6a318ae91013763b4d?rik=5%2f%2bHCyVqjZGAUQ&riu=http%3a%2f%2fs3.xchuxing.com%2fxchuxing%2farticle%2f2023%2f11%2f01%2f3424f202311012059239115.jpg&ehk=F4a6PTkUPtAINyC2fvCKRzaKCvGUPal1cesiHMM2va0%3d&risl=&pid=ImgRaw&r=0"
    async function getImg(){
        const response = await apiClient.get('apiForChargingStation/user/getCarImage',{
            params:{
                carVin: userInfoStore.userInfo.car_brand,
                carType: userInfoStore.userInfo.car_type
            }
        });
        if(response.data.isSuccess){
            imgurl = response.data.data;
        }else{
            alert("获取车辆图片失败");
        }
    }
    function Go(){
        useNavigationStore().setTrigger('car', 'navigate', {
            destination: 'home'
        });
        router.push('/navigation');
    }
    onMounted(async ()=>{
        
    })
    
</script>
<template>
    <div class="car-main-page">
        <div class="car-image-container">
            <div>你好，{{ userInfoStore.userInfo.name }}</div>
            <img :src="imgurl" alt="车辆图片" class="car-image" />
        </div>
        <div class="button-group">
            <button class="main-btn" @click="Go">
                一键导航
            </button>
            <button class="main-btn" @click="router.push('/charging')">
                充电站查询
            </button>
            <button class="main-btn" @click="router.push('/maintenance')">
                车辆保养
            </button>
            <button class="main-btn" @click="router.push('/profile')">
                我的信息
            </button>
        </div>
    </div>
</template>
<style>
.car-main-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}
.car-image-container {
    
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 5vw;
    img{
        width: 50%;
        height: auto;
        max-width: 600px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    }
}
.button-group {
    display: flex;
    flex-direction: column;
    width: 90vw;
    max-width: 400px;
    margin: 30px auto 0 auto;
    gap: 16px;
}

.main-btn {
    width: 100%;
    padding: 14px 0;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    background: #1976d2;
    color: #fff;
    box-shadow: 0 2px 6px rgba(25, 118, 210, 0.15);
    transition: background 0.2s;
}

.main-btn:active {
    background: #1565c0;
}
@media(min-width: 768px){
    .button-group {
    display: flex;
    flex-direction: row;
    width: 90vw;
    max-width: 400px;
    margin: 30px auto 0 auto;
    gap: 16px;
}
}
</style> 