<!-- NavigationView.vue -->
<template>
    <div class="navigation-container">
        <!-- 搜索面板 -->
        <div class="search-panel">
            <div class="search-box">
                <input v-model="startKeyword" placeholder="请输入起点" @keyup.enter="searchStart" />
                <button @click="searchStart">搜索起点</button>
            </div>

            <div class="search-box">
                <input v-model="endKeyword" placeholder="请输入终点" @keyup.enter="searchEnd" />
                <button @click="searchEnd">搜索终点</button>
            </div>

            <!-- 选中的位置信息 -->
            <div class="selected-info" v-if="startPosition || endPosition">
                <div v-if="startPosition" class="info-item">
                    <span class="label">起点：</span>{{ startPosition.name }}
                </div>
                <div v-if="endPosition" class="info-item">
                    <span class="label">终点：</span>{{ endPosition.name }}
                </div>
            </div>

            <!-- 路径规划按钮 -->
            <div class="action-buttons">
                <button @click="planRoute" :disabled="!startPosition || !endPosition">
                    路线规划
                </button>
                <button @click="clearRoute">清除路线</button>
            </div>

            <!-- 路线信息 -->
            <div class="route-info" v-if="routeInfo">
                <div class="route-summary">
                    <p>总距离：{{ routeInfo.distance }} 公里</p>
                    <p>预计时间：{{ routeInfo.time }} 分钟</p>
                </div>
            </div>
        </div>

        <!-- 地图容器 -->
        <div id="map-container"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 高德地图相关变量
let map: AMap.Map
let autoCompleteStart: AMap.AutoComplete
let autoCompleteEnd: AMap.AutoComplete
let markerStart: AMap.Marker
let markerEnd: AMap.Marker
let driving: AMap.Driving

// 响应式数据
const startKeyword = ref('')
const endKeyword = ref('')
const startPosition = ref<{ lng: number; lat: number; name: string } | null>(null)
const endPosition = ref<{ lng: number; lat: number; name: string } | null>(null)
const routeInfo = ref<{ distance: string; time: string } | null>(null)

// 初始化地图
const initMap = () => {
    // 这里替换成你的高德地图Key
    const AMap = window.AMap

    map = new AMap.Map('map-container', {
        zoom: 11,
        center: [116.397428, 39.90923], // 默认北京中心
        viewMode: '2D'
    })

    // 初始化驾车路线规划
    driving = new AMap.Driving({
        map: map,
        panel: 'panel'
    })

    // 初始化自动完成
    autoCompleteStart = new AMap.AutoComplete({
        input: startKeyword.value
    })

    autoCompleteEnd = new AMap.AutoComplete({
        input: endKeyword.value
    })

    // 添加点击地图选择位置功能
    map.on('click', (e: any) => {
        const { lng, lat } = e.lnglat
        if (!startPosition.value) {
            setStartPosition(lng, lat, '点击选择的位置')
        } else if (!endPosition.value) {
            setEndPosition(lng, lat, '点击选择的位置')
        }
    })
}

// 搜索起点
const searchStart = async () => {
    if (!startKeyword.value) return

    try {
        const AMap = window.AMap
        const geocoder = new AMap.Geocoder()

        geocoder.getLocation(startKeyword.value, (status: string, result: any) => {
            if (status === 'complete' && result.geocodes.length) {
                const location = result.geocodes[0].location
                const name = result.geocodes[0].formattedAddress
                setStartPosition(location.lng, location.lat, name)
            } else {
                alert('未找到该地点')
            }
        })
    } catch (error) {
        console.error('搜索失败', error)
    }
}

// 搜索终点
const searchEnd = async () => {
    if (!endKeyword.value) return

    try {
        const AMap = window.AMap
        const geocoder = new AMap.Geocoder()

        geocoder.getLocation(endKeyword.value, (status: string, result: any) => {
            if (status === 'complete' && result.geocodes.length) {
                const location = result.geocodes[0].location
                const name = result.geocodes[0].formattedAddress
                setEndPosition(location.lng, location.lat, name)
            } else {
                alert('未找到该地点')
            }
        })
    } catch (error) {
        console.error('搜索失败', error)
    }
}

// 设置起点
const setStartPosition = (lng: number, lat: number, name: string) => {
    startPosition.value = { lng, lat, name }

    // 移除旧的起点标记
    if (markerStart) {
        map.remove(markerStart)
    }

    // 添加新的起点标记
    const AMap = window.AMap
    markerStart = new AMap.Marker({
        position: [lng, lat],
        map: map,
        title: name,
        label: {
            content: '起点',
            direction: 'top'
        }
    })

    // 设置地图中心
    map.setCenter([lng, lat])

    // 清除之前的路线
    clearRoute()
}

// 设置终点
const setEndPosition = (lng: number, lat: number, name: string) => {
    endPosition.value = { lng, lat, name }

    // 移除旧的终点标记
    if (markerEnd) {
        map.remove(markerEnd)
    }

    // 添加新的终点标记
    const AMap = window.AMap
    markerEnd = new AMap.Marker({
        position: [lng, lat],
        map: map,
        title: name,
        label: {
            content: '终点',
            direction: 'top'
        }
    })

    // 清除之前的路线
    clearRoute()
}

// 路线规划
const planRoute = () => {
    if (!startPosition.value || !endPosition.value) {
        alert('请先选择起点和终点')
        return
    }

    driving.search(
        new AMap.LngLat(startPosition.value.lng, startPosition.value.lat),
        new AMap.LngLat(endPosition.value.lng, endPosition.value.lat),
        (status: string, result: any) => {
            if (status === 'complete') {
                const route = result.routes[0]
                const distance = (route.distance / 1000).toFixed(2)
                const time = Math.ceil(route.time / 60)

                routeInfo.value = {
                    distance: distance,
                    time: time.toString()
                }
            }
        }
    )
}

// 清除路线
const clearRoute = () => {
    driving.clear()
    routeInfo.value = null
}

// 加载高德地图脚本
const loadAMapScript = () => {
    return new Promise((resolve, reject) => {
        // 这里替换成你的高德地图Key
        const key = '5306e7844bae04c765044d516c2f3b4d'
        const url = `https://webapi.amap.com/maps?v=2.0&key=${key}&callback=initAMap`

        // 创建script标签
        const script = document.createElement('script')
        script.src = url
        script.async = true

            // 定义全局回调
            ; (window as any).initAMap = () => {
                resolve(true)
            }

        script.onerror = reject
        document.head.appendChild(script)
    })
}

// 生命周期钩子
onMounted(async () => {
    try {
        // 检查是否已加载高德地图
        if (!window.AMap) {
            await loadAMapScript()
        }
        initMap()
    } catch (error) {
        console.error('地图加载失败', error)
    }
})

onUnmounted(() => {
    // 清理资源
    if (map) {
        map.destroy()
    }
})
</script>

<style scoped>
.navigation-container {
    width: 100%;
    height: 100vh;
    position: relative;
}

#map-container {
    width: 100%;
    height: 100%;
}

.search-panel {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 320px;
}

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.search-box input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.search-box input:focus {
    outline: none;
    border-color: #1890ff;
}

.search-box button {
    padding: 8px 16px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
}

.search-box button:hover {
    background: #40a9ff;
}

.selected-info {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
}

.info-item {
    margin: 5px 0;
    font-size: 14px;
}

.info-item .label {
    font-weight: bold;
    color: #666;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.action-buttons button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.action-buttons button:first-child {
    background: #52c41a;
    color: white;
}

.action-buttons button:first-child:hover {
    background: #73d13d;
}

.action-buttons button:first-child:disabled {
    background: #b7eb8f;
    cursor: not-allowed;
}

.action-buttons button:last-child {
    background: #ff4d4f;
    color: white;
}

.action-buttons button:last-child:hover {
    background: #ff7875;
}

.route-info {
    background: #e6f7ff;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #91d5ff;
}

.route-summary {
    display: flex;
    gap: 20px;
}

.route-summary p {
    margin: 5px 0;
    font-size: 14px;
    color: #0050b3;
}
</style>