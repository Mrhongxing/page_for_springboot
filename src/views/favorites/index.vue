<template>
    <div class="favorites-page">
        <div class="name-container">
            <div>我的收藏地点</div>
        </div>
        <div class="favorite-container">
            <div class="favorite-item" v-for="value in source" :key="value.id">
                <div>{{ value.address }}</div>
                <div class="useful-buttons">
                    <button class="useful-button" @click="goToLocation(value)">现在去</button>
                    <button class="delete-button" @click="removeFavorite(value.id)">×</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import apiClient from '@/apiClient/apiClient';
import { onMounted, ref, useAttrs } from 'vue';
import '@/style/index.css';
import { useUserInfoStore } from '@/stores/UserInfo';
import { useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/navigateStore';
const router = useRouter();
const userInfo = useUserInfoStore();
const source = ref([
    {
        id: 1,
        name: '地点1',
        address: '地址1'
    }
]);
async function fetchFavorites() {
    try {
        const response = await apiClient.get("/apiForChargingStation/favorites/getFavorites", {
            params: {
                userId: userInfo.id
            }
        });
        source.value = response.data;
        if (source.value.length === 0) {
            document.querySelector('.favorite-container').innerHTML = '<div style="font-size: 1.5rem; color: var(--text-main);">暂无收藏地点</div>';
        } else {
            console.log('获取收藏地点成功:', source.value);
        }
    } catch (error) {
        console.error('获取收藏地点失败:', error);
    }
}
async function removeFavorite(id) {
    try {
        await apiClient.delete("/apiForChargingStation/favorites/deleteFavorites", {
            params: {
                id: id
            }
        });
        console.log('删除收藏地点成功');
        fetchFavorites(); // 刷新收藏地点列表
    } catch (error) {
        console.error('删除收藏地点失败:', error);
    }
}
function goToLocation(value) {
    useNavigationStore().setTrigger('favorites', 'navigate', {
        destination: value.address,
        latitude: value.latitude,
        longitude: value.longitude
    });
    router.push('/navigation');
}
onMounted(() => {
    fetchFavorites();
});
</script>
<style>
.useful-buttons{
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
    flex-shrink: 0;
}
div {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.favorites-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-main);
    background:
        var(--page-background);
    gap: 4vh;
    justify-content: center;
    min-height: 100vh;

    .name-container {
        display: flex;
        min-width: 175px;
        width: 70%;
        max-width: 700px;
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
            flex-direction: row;
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
                padding: 10px;
                background: var(--button-background);
                color: var(--text-soft);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
            }

            .delete-button {
                padding: 10px;
                background-color: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
                color: var(--text-main);
            }
        }
    }
}
</style>