<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted, ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
let map: any = null;
const markerContent = `<div class="custom-content-marker">
<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
<div class="close-btn" onclick="clearMarker()">X</div>
</div>`
let amap: any = null;
const searchInput = ref('');
let searchResults: any = null;
function search() {
    AMapLoader.load({
        key: "5306e7844bae04c765044d516c2f3b4d", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    }).then((AMap) => {
        AMap.plugin(["AMap.PlaceSearch"], function () {
            const placeSearch = new AMap.PlaceSearch({
                pageSize: 5, //单页显示结果条数
                pageIndex: 1, //页码
                city: useCounterStore().provinceName, //兴趣点城市
                citylimit: true, //是否强制限制在设置的城市内搜索
                //location: useCounterStore().localPlace, //设置周边搜索中心点
                map: map, //展现结果的地图实例
                panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
                autoFitView: true, //是否自动调整地图视野使绘制的 Marker 点都处于视口的可见范围
            });
            //AMap.event.addListener(placeSearch, "complete", keywordSearch_CallBack); //返回结果
            /* placeSearch.search('西域'); //关键字查询 */
            //placeSearch.search(searchInput.value, function (status, result) { console.log(status, result) });  //使用插件搜索关键字并查看结果
            placeSearch.searchNearBy(searchInput.value,useCounterStore().localPlace, function (status, result) { console.log(status, result) });  //使用插件搜索关键字并查看结果
        });
    }).catch((e) => {
        console.log(e);
    });
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
        plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Geocoder", "AMap.Marker", "AMap.Traffic","AMap.CitySearch","AMap.Heatmap"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
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
                                // 如果是直辖市（北京、上海、天津、重庆），city字段可能为空，改用province
                                /* if (!cityName || cityName.length === 0) {
                                    cityName = addressComponent.province;
                                }

                                console.log('当前城市:', cityName);
                                console.log('完整地址组件:', addressComponent); */
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
        <div id="my-panel"></div>
        <div class="search">
            <input type="text" v-model="searchInput" placeholder="请输入搜索内容" />
            <button @click="search">搜索</button>
        </div>
    </div>
</template>
<style scoped>
#container {
    width: 100%;
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
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 10;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 320px;
}

.search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: white;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search input {
    width: 200px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

.search button {
    padding: 5px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>