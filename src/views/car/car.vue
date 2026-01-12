<script setup name="car" lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserInfoStore } from '@/stores/UserInfo';
    import apiClient from '@/apiClient/apiClient';
    const router = useRouter();
    const userInfoStore = useUserInfoStore();
    let imgurl = ""
    async function getImg(){
        const response = await apiClient.get('apiForChargingStation/user/getCarImage',{
            params:{
                carVin: userInfoStore.carVin,
                carType: userInfoStore.carType
            }
        });
        if(response.data.isSuccess){
            imgurl = response.data.data;
        }else{
            alert("获取车辆图片失败");
        }
    }
    onMounted(async ()=>{
        await getImg();
    })
    
</script>
<template>
    <div>
        <div>Hi,{{ userInfoStore.petName }}</div>
        <div></div>
    </div>
</template>
<style>
</style> 