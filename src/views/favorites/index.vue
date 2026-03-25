<template>
    <div class="favorites-page">
        <div class="name-container">
            <div>我的收藏地点</div>
        </div>
        <div class="favorite-container">
            <div class="favorite-item" v-for="value in source" :key="value.id">
                <div>{{ value.address }}</div>
                <button class="useful-button" @click="goToLocation(value)">现在去</button>
                <button class="delete-button" @click="removeFavorite(value.id)">X</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import apiClient from '@/apiClient/apiClient';
import { onMounted, ref, useAttrs } from 'vue';
import '@/style/index.css';
import { useUserInfoStore } from '@/stores/UserInfo';
const userInfo = useUserInfoStore();
const source = ref([
    {
        id: 1,
        name: '地点1',
        address: '地址1'
    }
]);
async function fetchFavorites() {
    console.log('正在获取收藏地点，用户ID:', userInfo.id);
    try {
        const response = await apiClient.get("/apiForChargingStation/favorites/getFavorites", {
            params: {
                userId: userInfo.id
            }
        });
        source.value = response.data;
        console.log('获取收藏地点成功:', response.data);
    } catch (error) {
        console.error('获取收藏地点失败:', error);
    }
}
onMounted(() => {
    fetchFavorites();
});
</script>
<style>
.favorites-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-main);
    background:
        var(--page-background);
    gap: 20px;
    justify-content: center;
    min-height: 100vh;
    .name-container {
        display: flex;
        min-width: 200px;
        width: 80%;
        max-width: 800px;
        justify-content: center;
        font-size: clamp(1.4rem, 3.8vw, 2.2rem);
        align-items: center;
        min-height: 100px;
        box-shadow:
            var(--box-shadow);
        backdrop-filter: blur(16px) saturate(120%);
        -webkit-backdrop-filter: blur(16px) saturate(120%);
        border-radius: 22px;
        background: var(--title-background);
    }
    .favorite-container {
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 200px;
        width: 80%;
        max-width: 800px;
        box-shadow:
            var(--box-shadow);
        backdrop-filter: blur(16px) saturate(120%);
        background: var(--first-background);
        border-radius: 22px;
        align-items: center;
        box-sizing: border-box;
        padding: 20px;
        .favorite-item {
            display: flex;
            flex-direction:row;
            padding: 20px;
            align-items: center;
            justify-content: space-around;
            box-shadow:
                var(--box-shadow);
            backdrop-filter: blur(16px) saturate(120%);
            -webkit-backdrop-filter: blur(16px) saturate(120%);
            border-radius: 22px;
            width: 90%;
            background: var(--first-background);
            .useful-button {
                padding: 10px ;
                background: var(--button-background);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
            }
            .delete-button {
                padding: 10px ;
                background-color: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
            }
        }
    }
}
</style>