<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted, ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
import { useNavigationStore } from '@/stores/navigateStore';
import '@/style/index.css';
import apiClient from '@/apiClient/apiClient';
import { useUserInfoStore } from '@/stores/UserInfo';
let map: any = null;
const markerContent = `<div class="custom-content-marker">
<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
<div class="close-btn" onclick="clearMarker()">位置</div>
</div>`
let amap: any = null;
let driving: any = null;
let placeSearch = null;
const resultList = ref(null);
const searchInput = ref('');
const searchResults = ref([
]);
const pageIndex = ref(0)
const resultArray = ref([1]);
const showArray = ref([1]);
const isDriving = ref<Element>(null);
function search(data: any) {
    resultArray.value = [];
    showArray.value = [];
    map.clearMap();
    if (driving) {
        driving.clear();
    }
    if (map) {
        map.setCenter(useCounterStore().localPlace);
        map.setZoom(15); // 放大到合适级别
    }
    if (data) {
        pageIndex.value = data - 1
    } else {
        data = 1;
        pageIndex.value = data - 1
    }
    if(isDriving.value && isDriving.value.style.display === 'block'){
        isDriving.value.style.display = 'none';
    }
    const positionMark = new amap.LngLat(useCounterStore().localPlace[0], useCounterStore().localPlace[1]); //Marker 经纬度
    const marker = new amap.Marker({
        position: positionMark, //Marker 经纬度
        content: markerContent, //将 html 传给 content
        offset: new amap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    });
    map.add(marker);
    const traffic = new amap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 180, //刷新间隔，默认180s
    });
    amap.plugin(["AMap.PlaceSearch"], function () {
        placeSearch = new amap.PlaceSearch({
            pageSize: 5, //单页显示结果条数
            pageIndex: data, //页码
            city: useCounterStore().provinceName, //兴趣点城市
            citylimit: true, //是否强制限制在设置的城市内搜索
            //location: useCounterStore().localPlace, //设置周边搜索中心点
            map: map, //展现结果的地图实例
            panel: false, //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
            autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
        });
        //AMap.event.addListener(placeSearch, "complete", keywordSearch_CallBack); //返回结果
        /* placeSearch.search('西域'); //关键字查询 */
        //placeSearch.search(searchInput.value, function (status, result) { console.log(status, result) });  //使用插件搜索关键字并查看结果
        console.log('搜索内容:', searchInput.value);
        placeSearch.searchNearBy(searchInput.value, useCounterStore().localPlace, 5000, function (status: any, result: any) {
            console.log('附近搜索回调状态:', status); console.log('附近搜索结果:', result); map.setCenter([result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]); searchResults.value = result.poiList.pois;
            if (result.poiList.count % 5 === 0) {
                for (let i = 0; i < result.poiList.count / 5; i++) {
                    resultArray.value[i] = i + 1;
                }
            } else {

                for (let i = 0; i < Math.floor(result.poiList.count / 5) + 1; i++) {
                    resultArray.value[i] = i + 1;
                    console.log(resultArray.value);
                }

            }
            console.log('分页数组:', resultArray.value);
            if (resultArray.value.length < 5) {
                showArray.value = resultArray.value;
            } else {
                if (pageIndex.value < 2) {
                    for (let o = 0; o < 4; o++) {
                        showArray.value[o] = resultArray.value[o + pageIndex.value];
                        
                    }
                } else {
                    for (let o = 0; o < 4; o++) {
                        if (o + pageIndex.value - 1 < resultArray.value.length) {
                            showArray.value[o] = resultArray.value[o + pageIndex.value - 1];
                            console.log(showArray.value);
                        }
                    }
                }
            }

        });  //使用插件搜索关键字并查看结果
    });
    if (resultList.value) {
        resultList.value.style.display = 'flex';
    }
    console.log('搜索结果:', resultArray.value);
}

function fucos(lat: number, lng: number) {
    map.setCenter([lng, lat]);
}
function toStart() {
    pageIndex.value = 0;
    search(pageIndex.value + 1);
}
function toFont() {
    if (pageIndex.value > 0) {
        pageIndex.value -= 1;
        search(pageIndex.value + 1);
    }
}
function toNext() {
    if (pageIndex.value < resultArray.value.length - 1) {
        pageIndex.value += 1;
        search(pageIndex.value + 1);
    }
}
async function favorite(item: any) {
    const response = await apiClient.post('/apiForChargingStation/favorites/addFavorites', {
        userId:useUserInfoStore().userInfo.id,
        address: item.name,
        longitude: item.location.lng,
        latitude: item.location.lat
    });
    console.log('添加收藏地点成功:', response.data);
}
function goToLocation(item: any) {
    map.clearMap();
    if (driving) {
        driving.clear();
    }
    if (map) {
        map.setCenter(useCounterStore().localPlace);
        map.setZoom(15); // 放大到合适级别
    }
    const positionMark = new amap.LngLat(useCounterStore().localPlace[0], useCounterStore().localPlace[1]); //Marker 经纬度
    const marker = new amap.Marker({
        position: positionMark, //Marker 经纬度
        content: markerContent, //将 html 传给 content
        offset: new amap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    });
    map.add(marker);
    const traffic = new amap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 180, //刷新间隔，默认180s
    });
    const startLngLat = [item.location.lng, item.location.lat] //起始点坐标

    //引入和创建驾车规划插件
    amap.plugin(["AMap.Driving"], function () {
        driving = new amap.Driving({
            map: map,
            panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>
        });
        //获取起终点规划线路
        driving.search(useCounterStore().localPlace, startLngLat, function (status: any, result: any) {
            if (status === "complete") {
                //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
                //查询成功时，result 即为对应的驾车导航信息
                console.log(result);
            } else {
                console.log("获取驾车数据失败：" + result);
            }
        });
    });
    if(isDriving.value){
        isDriving.value.style.display = 'block';
    }
}
onMounted(() => {
   
    let latitude = 39.90923; // 纬度
    let longitude = 116.397428; // 经度
    (window as any)._AMapSecurityConfig = {
        securityJsCode: "d012ab2fd0f0fe0113b39e580923ad17",
    };
    AMapLoader.load({
        key: "5306e7844bae04c765044d516c2f3b4d", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Driving", "AMap.Scale", "AMap.ToolBar", "AMap.Geocoder", "AMap.Marker", "AMap.Traffic", "AMap.CitySearch", "AMap.Heatmap"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    }).then((AMap) => {
        amap = AMap;
        map = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "3D", // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: [longitude, latitude], // 初始化地图中心点位置
        });
        if ("geolocation" in navigator) {
            // 支持，获取位置
            navigator.geolocation.getCurrentPosition(
                // 成功回调
                (position) => {
                    latitude = position.coords.latitude;   // 纬度
                    longitude = position.coords.longitude; // 经度
                    const accuracy = position.coords.accuracy;    // 精度（米）
                    console.log('当前位置:', { latitude, longitude, accuracy });
                    useCounterStore().localpalce = [longitude, latitude];
                    // 可以在这里将地图中心移动到该位置
                    if (map) {
                        map.setCenter([longitude, latitude]);
                        map.setZoom(15); // 放大到合适级别
                    }
                    const positionMark = new AMap.LngLat(longitude, latitude); //Marker 经纬度
                    const marker = new AMap.Marker({
                        position: positionMark, //Marker 经纬度
                        content: markerContent, //将 html 传给 content
                        offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
                    });
                    map.add(marker);
                    const traffic = new AMap.TileLayer.Traffic({
                        autoRefresh: true, //是否自动刷新，默认为false
                        interval: 180, //刷新间隔，默认180s
                    });
                    AMap.plugin('AMap.ToolBar', function () {
                        var toolbar = new AMap.ToolBar(); //缩放工具条实例化
                        var scale = new AMap.Scale(); //比例尺实例化
                        map.addControl(scale); //添加比例尺控件
                        map.addControl(toolbar); //添加控件
                    });
                    map.add(traffic); //通过add方法添加图层     
                    AMap.plugin('AMap.Geocoder', () => {
                        console.log('AMap.Geocoder插件加载成功');
                        const geocoder = new AMap.Geocoder({});
                        geocoder.getAddress([longitude, latitude], (status: string, result: any) => {
                            console.log('逆地理编码回调状态:', status);
                            if (status === 'complete' && result.regeocode) {
                                const addressComponent = result.regeocode.addressComponent;
                                console.log('逆地理编码结果:', addressComponent);
                                // 提取城市信息（处理直辖市特殊情况）
                                /* let cityName = addressComponent.city; */
                                useCounterStore().province = addressComponent.province;
                                if (useNavigationStore().from === 'car') {
                                    useNavigationStore().clearTrigger();
                                    AMap.plugin(["AMap.PlaceSearch"], function () {
                                        placeSearch = new AMap.PlaceSearch({
                                            pageSize: 5, //单页显示结果条数
                                            pageIndex: 1, //页码
                                            city: useCounterStore().provinceName, //兴趣点城市
                                            citylimit: true, //是否强制限制在设置的城市内搜索
                                            //location: useCounterStore().localPlace, //设置周边搜索中心点
                                            map: map, //展现结果的地图实例
                                            panel: false, //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
                                            autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
                                        });
                                        placeSearch.searchNearBy("充电站", useCounterStore().localPlace, 5000, function (status: any, result: any) {
                                            console.log('附近搜索回调状态:', status);
                                            console.log('附近搜索结果:', result);
                                            const startLngLat = [longitude, latitude] //起始点坐标
                                            const endLngLat = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat] //终点坐标
                                            //引入和创建驾车规划插件
                                            AMap.plugin(["AMap.Driving"], function () {
                                                driving = new AMap.Driving({
                                                    map: map,
                                                    panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>
                                                });
                                                //获取起终点规划线路
                                                driving.search(startLngLat, endLngLat, function (status: any, result: any) {
                                                    if (status === "complete") {
                                                        //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
                                                        //查询成功时，result 即为对应的驾车导航信息
                                                        console.log(result);
                                                    } else {
                                                        console.log("获取驾车数据失败：" + result);
                                                    }
                                                    if(isDriving.value){
        isDriving.value.style.display = 'block';
    }
                                                });
                                            });
                                        });  //使用插件搜索关键字并查看结果
                                    })
                                } else if (useNavigationStore().from === 'favorites') {

                                    const startLngLat = [longitude, latitude] //起始点坐标
                                    const endLngLat = [useNavigationStore().data.longitude, useNavigationStore().data.latitude] //终点坐标
                                    //引入和创建驾车规划插件
                                    AMap.plugin(["AMap.Driving"], function () {
                                        driving = new AMap.Driving({
                                            map: map,
                                            panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>
                                        });
                                        //获取起终点规划线路
                                        driving.search(startLngLat, endLngLat, function (status: any, result: any) {
                                            if (status === "complete") {
                                                //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
                                                //查询成功时，result 即为对应的驾车导航信息
                                                console.log(result);
                                            } else {
                                                console.log("获取驾车数据失败：" + result);
                                            }
                                            if(isDriving.value){
        isDriving.value.style.display = 'block';
    }
                                        });
                                    });
                                    useNavigationStore().clearTrigger();

                                }
                            }
                        });
                    });


                },
                // 失败回调
                (error) => {
                    let message = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = '用户拒绝了定位权限';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = '无法获取位置信息';
                            break;
                        case error.TIMEOUT:
                            message = '定位请求超时';
                            break;
                        default:
                            message = '未知错误';
                    }
                    console.error('定位失败:', message);
                    const traffic = new AMap.TileLayer.Traffic({
                        autoRefresh: true, //是否自动刷新，默认为false
                        interval: 180, //刷新间隔，默认180s
                    });
                    AMap.plugin('AMap.ToolBar', function () {
                        var toolbar = new AMap.ToolBar(); //缩放工具条实例化
                        var scale = new AMap.Scale(); //比例尺实例化
                        map.addControl(scale); //添加比例尺控件
                        map.addControl(toolbar); //添加控件
                    });
                    map.add(traffic); //通过add方法添加图层       
                },
                // 可选配置
                {
                    enableHighAccuracy: true,  // 高精度模式（使用GPS）
                    timeout: 10000,            // 超时时间10秒
                    maximumAge: 0              // 不接受缓存位置
                }
            );
        } else {
            console.error('浏览器不支持地理定位');
        }
    }).catch((e) => {
        console.log(e);
    });
    /* function clearMarker() {
        map.remove(marker); //清除 marker
    }
    document.querySelector(".close-btn").onclick = clearMarker; //绑定点击事件 */

});
onUnmounted(() => {
    map?.destroy();
});

</script>
<template>
    <div class="navigation-container">
        <div id="container"></div>
        <div ref="isDriving" id="my-panel"></div>
        <div class="search">
            <input type="text" v-model="searchInput" placeholder="请输入搜索内容" />
            <button @click="search(false)">搜索</button>
        </div>
        <div ref="resultList" class="search_result">
            <div class="list">
                <div @click="fucos(item.location.lat, item.location.lng)" class="list_first"
                    v-for="(item, index) in searchResults" :key="index">
                    <div v-if="item.photos" class="list_img"><img :src="item.photos[0].url" alt="图片" /></div>
                    <div class="list_second">
                        <div>{{ item.name }}</div>
                        <div>{{ item.address }}</div>
                    </div>
                    <div class="useful-button">
                        <div @click="favorite(item)">收藏</div>
                        <div @click="goToLocation(item)">前往</div>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <button @click="toStart">首页</button>
                <button @click="toFont">上一页</button>
                <button @click="search(item)" :disabled="item == pageIndex + 1" v-for="(item, index) in showArray"
                    :key="index">{{ item }}</button>
                <button @click="toNext">下一页</button>
            </div>

        </div>
    </div>
</template>
<style scoped>
.navigation-container {
    overflow: hidden;
    width: 100vw;
}

#container {
    width: 100vw;
    height: 100vh;

}

.custom-content-marker {
    position: relative;
    width: 25px;
    height: 34px;
}

.custom-content-marker img {
    width: 100%;
    height: 100%;
}

.custom-content-marker .close-btn {
    position: absolute;
    top: -6px;
    right: -8px;
    width: 15px;
    height: 15px;
    font-size: 12px;
    background: #ccc;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 15px;
    box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
}

.custom-content-marker .close-btn:hover {
    background: #666;
}

#my-panel {
    display: none;
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 10;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    overflow: scroll;
    box-sizing: border-box;
}

.search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: var(--title-background);
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: end;
    width: fit-content;
    max-width: 600px;
    justify-content: space-between;

}

.search input {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-bottom: 2px solid var(--text-main);
    background: transparent;
    color: var(--text-main);
    font-size: inherit;
    transition: all 0.3s ease;
    outline: none;
    width: 40vw;

    &:focus {
        border-bottom-color: var(--text-soft);
        box-shadow: var(--box-shadow);
        transform: translateY(-2px);
    }
}

.search button {
    padding: 10px 15px;
    box-sizing: border-box;
    height: 100%;
    background: var(--button-background);
    color: var(--text-soft);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search_result {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 60px;
    left: 0;
    z-index: 10;
    background: var(--first-background);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: var(--box-shadow);
    overflow: auto;
    display: none;
    height: fit-content;
    width: 40vw;
    max-width: 600px;
}

.list {
    display: flex;
    flex-direction: column;
    height: fit-content;
    gap: 10px;
    width: 100%;

    .list_first {
        display: flex;
        flex-direction: row;
        padding: 10px;
        box-shadow:
            var(--box-shadow);
        backdrop-filter: blur(16px) saturate(120%);
        -webkit-backdrop-filter: blur(16px) saturate(120%);
        border-radius: 10px;
        background: var(--first-background);
        cursor: pointer;
        color: var(--text-main);
        transition: all 1s ease;
        height: 100px;

        &:hover {
            background: var(--button-background);
            color: var(--text-soft);
        }

        align-items: center;

        div {
            font-weight: 600;
        }

        .list_second {
            padding: 10px;
            display: flex;
            flex-direction: column;
        }

        .list_img {
            img {
                width: 80px;
                height: 80px;
                border-radius: 8px;
            }
        }
    }
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 10px;
    max-width: 100%;

    button {
        padding: 10px 10px;
        background: var(--first-background);
        box-shadow: var(--box-shadow);
        color: var(--text-main);
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:disabled {
            background: var(--button-background);
            color: var(--text-soft);
            cursor: not-allowed;
        }
    }
}

.useful-button {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
    flex-shrink: 0;

    div {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        border-radius: 10px;
    }

    div:hover {
        background: var(--first-background-gradient);
        color: var(--text-main);
        cursor: pointer;
    }
}

@media(max-width: 768px) {
    .navigation-container {
        overflow-y: scroll;
    }

    .search {
        max-width: 100vw;
        width: 100%;

        input {
            width: 100%;
        }

        box-sizing: border-box;
    }

    #my-panel {
        min-width: 100vw;
        min-height: calc(20vh + 56px);
        position: relative;
        padding: 0 0 20vh 0;
        overflow: visible;
    }

    .search_result {
        position: unset;
        box-sizing: border-box;
        width: 100%;
        top: 80vh;
        padding-bottom: 100px;
        max-width: 100vw;
    }

    #container {
        width: 100vw;
        height: 80vh;
    }
}
</style>