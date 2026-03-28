<script setup name="car" lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserInfoStore } from '@/stores/UserInfo';
    import { useNavigationStore } from '@/stores/navigateStore';
    import apiClient from '@/apiClient/apiClient';
    import '@/style/index.css';
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
            <div class="welcome-text">你好，{{ userInfoStore.userInfo.name }}</div>
            <img :src="imgurl" alt="车辆图片" class="car-image" />
        </div>
        <div class="button-group">
            <button class="main-btn" @click="Go">
                一键导航
            </button>
            <button class="main-btn" @click="router.push('/search')">
                充电站查询
            </button>
            <button class="main-btn" @click="router.push('/favorites')">
                我的收藏
            </button>
            <button class="main-btn" @click="router.push('/user')">
                我的信息
            </button>
        </div>
    </div>
</template>
<style>
.car-main-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px 16px;
    box-sizing: border-box;
    color: var(--text-main);
    background:var(--page-background);
}
.car-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 22px;
    border-radius: 22px;
    font-size: clamp(1.4rem, 3.8vw, 2.2rem);
    background: linear-gradient(145deg, var(--glass-bg-strong), var(--glass-bg));
    border: 1px solid var(--glass-border-soft);
    box-shadow:var(--box-shadow);
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
}

.welcome-text {
    width: 100%;
    text-align: center;
    color: var(--text-main);
    letter-spacing: 0.04em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.car-image {
    width: 100%;
    max-width: 620px;
    height: auto;
    border-radius: 16px;
    border: 1px solid var(--glass-border);
    box-shadow:var(--box-shadow);
}
.button-group {
    display: flex;
    flex-direction: column;
    width: min(100%, 960px);
    margin: 0 auto;
    gap: 14px;
}
.main-btn {
    width: 100%;
    padding: 14px 18px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    color: var(--text-main);
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.45));
    box-shadow:var(--box-shadow);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.main-btn:hover {
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.58));
    box-shadow:var(--box-shadow);
}

.main-btn:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.7);
    outline-offset: 2px;
}

.main-btn:active {
    transform: translateY(1px) scale(0.995);
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35));
    box-shadow:var(--box-shadow);
}

@media (min-width: 768px) {
    .car-main-page {
        padding: 36px 24px;
    }

    .car-image-container {
        flex-direction: row;
        justify-content: space-between;
        gap: 28px;
    }

    .welcome-text {
        width: auto;
        text-align: left;
        flex: 1;
    }

    .car-image {
        width: 58%;
        min-width: 360px;
    }

    .button-group {
        flex-direction: row;
        gap: 16px;
    }
}
</style> 