<template>
    <div class="favorites-page">
        <div class="name-container">
            <div>我的收藏地点</div>
        </div>
        <div class="favorite-container">
            <div class="favorite-item" v-for="value in source" :key="value.id">
                <div>{{ value.name }}</div>
                <div>{{ value.address }}</div>
                <button class="useful-button" @click="goToLocation(value)">现在去</button>
                <button class="useful-button" @click="removeFavorite(value.id)">取消收藏</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import apiClient from '@/apiClient/apiClient';
import { onMounted, ref } from 'vue';
import '@/style/index.css';
const source = ref([
    {
        id: 1,
        name: '地点1',
        address: '地址1'
    },
    {
        id: 2,
        name: '地点2',
        address: '地址2'
    },
    {
        id: 3,
        name: '地点3',
        address: '地址3'
    },{
        id: 4,
        name: '地点4',
        address: '地址4'
    },{
        id: 5,
        name: '地点5',
        address: '地址5'
    }
]);

</script>
<style>
.favorites-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-main);
    background:
        radial-gradient(circle at 16% 22%, rgba(255, 255, 255, 0.96), transparent 46%),
        radial-gradient(circle at 82% 78%, rgba(255, 255, 255, 0.88), transparent 38%),
        linear-gradient(145deg, #ececec 0%, #dddddd 40%, #d3d3d3 100%);
    gap: 20px;
    justify-content: space-around;
    min-height: 100vh;
    .name-container {
        display: flex;
        min-width: 200px;
        width: 80%;
        justify-content: center;
        font-size: clamp(1.4rem, 3.8vw, 2.2rem);
        align-items: center;
        min-height: 100px;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            0 16px 34px rgba(0, 0, 0, 0.28),
            0 5px 10px rgba(0, 0, 0, 0.14);
        backdrop-filter: blur(16px) saturate(120%);
        -webkit-backdrop-filter: blur(16px) saturate(120%);
        border-radius: 22px;
    }
    .favorite-container {
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 200px;
        width: 80%;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            0 16px 34px rgba(0, 0, 0, 0.28),
            0 5px 10px rgba(0, 0, 0, 0.14);
        backdrop-filter: blur(16px) saturate(120%);
        background:radial-gradient(circle at 16% 22%, rgba(255, 255, 255, 0.96), transparent 46%),
        radial-gradient(circle at 82% 78%, rgba(255, 255, 255, 0.88), transparent 38%),
        linear-gradient(145deg, #ececec 0%, #dddddd 40%, #d3d3d3 100%);
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
                inset 0 1px 0 rgba(255, 255, 255, 0.78),
                0 16px 34px rgba(0, 0, 0, 0.28),
                0 5px 10px rgba(0, 0, 0, 0.14);
            backdrop-filter: blur(16px) saturate(120%);
            -webkit-backdrop-filter: blur(16px) saturate(120%);
            border-radius: 22px;
            width: 90%;
            .useful-button {
                padding: 10px 20px;
                background: var(--button-background);
                color: white;
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