<script setup name="car" lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserInfoStore } from '@/stores/UserInfo';
    import { useNavigationStore } from '@/stores/navigateStore';
    import apiClient from '@/apiClient/apiClient';
    import '@/style/index.css';
    const router = useRouter();
    const userInfoStore = useUserInfoStore();
    let imgurl = "https://ts1.tc.mm.bing.net/th/id/R-C.462b0671d07d9b6a318ae91013763b4d?rik=5%2f%2bHCyVqjZGAUQ&riu=http%3a%2f%2fs3.xchuxing.com%2fxchuxing%2farticle%2f2023%2f11%2f01%2f3424f202311012059239115.jpg&ehk=F4a6PTkUPtAINyC2fvCKRzaKCvGUPal1cesiHMM2va0%3d&risl=&pid=ImgRaw&r=0"
    const tiltX = ref(0);
    const tiltY = ref(0);
    const cardStyle = computed(() => ({
        '--tilt-x': `${tiltX.value}deg`,
        '--tilt-y': `${tiltY.value}deg`
    }));
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
    function handlePointerMove(event: PointerEvent) {
        const target = event.currentTarget as HTMLElement;
        const bounds = target.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        tiltX.value = Number((-y * 7).toFixed(2));
        tiltY.value = Number((x * 9).toFixed(2));
    }
    function resetTilt() {
        tiltX.value = 0;
        tiltY.value = 0;
    }
    onMounted(async ()=>{
        
    })
    
</script>
<template>
    <div class="car-main-page" @pointermove="handlePointerMove" @pointerleave="resetTilt">
        <div class="ambient-orb ambient-orb-one"></div>
        <div class="ambient-orb ambient-orb-two"></div>
        <div class="hero-copy">
            <span class="eyebrow">ELECTRIC JOURNEY / 01</span>
            <h1>你好，{{ userInfoStore.userInfo.name }}</h1>
            <p>准备好开启下一段旅程了吗？</p>
        </div>
        <div class="car-image-container" :style="cardStyle">
            <div class="card-glow"></div>
            <div class="welcome-text">
                <span class="card-label">YOUR VEHICLE</span>
                <strong>智能出行<br />从此刻开始</strong>
                <span class="card-hint">移动指针探索</span>
            </div>
            <div class="image-stage">
                <div class="orbit orbit-one"></div>
                <div class="orbit orbit-two"></div>
                <img :src="imgurl" alt="车辆图片" class="car-image" />
            </div>
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
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    padding: 72px 16px 104px;
    box-sizing: border-box;
    color: var(--text-main);
    background:var(--page-background);
}
.car-main-page::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    opacity: 0.38;
    background-image: linear-gradient(rgba(70, 70, 90, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(70, 70, 90, 0.08) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, black, transparent 80%);
}
.hero-copy {
    width: min(100%, 1040px);
    text-align: left;
    z-index: 1;
}
.eyebrow, .card-label, .card-hint {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    opacity: 0.62;
}
.hero-copy h1 {
    margin: 8px 0 4px;
    font-size: clamp(2rem, 6vw, 4.8rem);
    letter-spacing: -0.06em;
    line-height: 0.98;
}
.hero-copy p {
    margin: 0;
    opacity: 0.62;
    font-size: 1rem;
}
.ambient-orb {
    position: absolute;
    z-index: -1;
    width: clamp(180px, 26vw, 360px);
    aspect-ratio: 1;
    border-radius: 50%;
    filter: blur(2px);
    pointer-events: none;
    animation: drift 10s ease-in-out infinite alternate;
}
.ambient-orb-one {
    top: 5%;
    right: 4%;
    background: radial-gradient(circle at 35% 30%, rgba(123, 164, 255, 0.58), rgba(123, 164, 255, 0));
}
.ambient-orb-two {
    bottom: 15%;
    left: -8%;
    background: radial-gradient(circle at 60% 40%, rgba(220, 122, 255, 0.35), rgba(220, 122, 255, 0));
    animation-delay: -4s;
}
@keyframes drift {
    to { transform: translate3d(0, 28px, 0) scale(1.08); }
}
.car-image-container {
    position: relative;
    display: flex;
    transform: perspective(1200px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transform-style: preserve-3d;
    transition: transform 0.18s ease-out;
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
.card-glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255,255,255,0.42), transparent 38%, rgba(109, 143, 255, 0.18));
    transform: translateZ(1px);
}

.welcome-text {
    width: 100%;
    text-align: center;
    color: var(--text-main);
    letter-spacing: 0.04em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateZ(34px);
}
.welcome-text strong {
    display: block;
    margin-top: 10px;
    font-size: clamp(1.6rem, 3.4vw, 2.8rem);
    letter-spacing: -0.05em;
    line-height: 1.05;
}
.card-hint {
    margin-top: 22px;
    font-size: 0.6rem;
}
.image-stage {
    position: relative;
    flex: 1;
    min-width: 0;
    transform: translateZ(22px);
}
.orbit {
    position: absolute;
    inset: 7% -4%;
    border: 1px solid rgba(255,255,255,0.38);
    border-radius: 50%;
    transform: rotate(-15deg) skewX(-12deg);
    pointer-events: none;
}
.orbit-two {
    inset: 18% 8%;
    transform: rotate(35deg) skewX(-18deg);
    border-color: rgba(142, 166, 255, 0.4);
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
    transform-style: preserve-3d;
}

.main-btn:hover {
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.58));
    box-shadow:var(--box-shadow);
    transform: translateY(-4px) translateZ(10px) rotateX(2deg);
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
        padding: 72px 24px 118px;
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

@media (prefers-reduced-motion: reduce) {
    .ambient-orb { animation: none; }
    .car-image-container { transition: none; transform: none; }
    .main-btn { transition: none; }
}

</style> 