<template>
    <div class="favorites-page">
        <div class="name-container">
            <div>我的收藏地点</div>
        </div>
        <div class="favorite-container">
            <div v-for="value in source" :key="value.id">
                <div>{{ value.name }}</div>
                <div>{{ value.address }}</div>
            </div>
        </div>
    </div>
    </template>
<script setup>
import apiClient from '@/apiClient/apiClient';
import { onMounted, ref } from 'vue';
import  '@/style/index.css';
const source = ref([]);

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
    }
}
</style>