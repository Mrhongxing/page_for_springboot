<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted, ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
import { useNavigationStore } from '@/stores/navigateStore';
import '@/style/index.css';
let map: any = null;
const markerContent = `<div class="custom-content-marker">
<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
<div class="close-btn" onclick="clearMarker()">X</div>
</div>`
let amap: any = null;
let driving:any = null;
let placeSearch = null;
const searchInput = ref('');
let searchResults: any = null;
const translateY = ref(0)
const containerRef = ref(null)
const handleScroll = (e) => {
  const scrollTop = e.target.scrollTop
  
  // 向上滑动时，元素向上移动
  // 最多移动 200px
  translateY.value = Math.min(scrollTop * 0.5, 200)
  
  console.log('滚动距离:', scrollTop, '移动距离:', translateY.value)
}
function search(data: any) {
        map.clearMap();
        if(driving){
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
        amap.plugin(["AMap.PlaceSearch"], function () {
            placeSearch = new amap.PlaceSearch({
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
            console.log('搜索内容:', searchInput.value);
            placeSearch.searchNearBy(searchInput.value, useCounterStore().localPlace, 5000, function (status: any, result: any) { map.setCenter([result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]); });  //使用插件搜索关键字并查看结果
        });
   
}
onMounted(() => {
    let latitude = 39.90923; // 纬度
    let longitude = 116.397428; // 经度
    const contentEl = document.querySelector('.navigation-container')
  if (contentEl) {
    contentEl.addEventListener('scroll', handleScroll)
  }else {
    console.warn('未找到导航容器元素，无法绑定滚动事件')}
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
                                            panel: "my-panel", //参数值为你页面定义容器的 id 值<div id="my-panel"></div>，结果列表将在此容器中进行展示。
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
                                                });
                                            });
                                        });  //使用插件搜索关键字并查看结果
                                    })
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
    const contentEl = document.querySelector('.content')
  if (contentEl) {
    contentEl.removeEventListener('scroll', handleScroll)
  }
    map?.destroy();
});

</script>
<template>
    <div class="navigation-container">
        <div id="container"></div>
        <div id="my-panel"></div>
        <div class="search">
            <input type="text" v-model="searchInput" placeholder="请输入搜索内容" />
            <button @click="search(false)">搜索</button>
        </div>
    </div>
</template>
<style scoped>
.navigation-container {
    overflow: scroll;
}
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
    box-shadow: var(--box-shadow);
    overflow: scroll;
    box-sizing: border-box;
}

.search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: white;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    align-items:end;
}

.search input{
            max-width: calc(100vw - 200px);
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-bottom: 2px solid var(--text-main);
            background: transparent;
            color: var(--text-main);
            font-size: inherit;
            transition: all 0.3s ease;
            outline: none;
            &:focus {
                border-bottom-color: #00d4ff;
                box-shadow: var(--box-shadow);
                transform: translateY(-2px);
            }
            &:hover {
                border-bottom-color: var(--button-background);
            }
        }

.search button {
    padding: 5px 15px;
    box-sizing: border-box;
    height: 100%;
    background: var(--button-background);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
@media(max-width: 768px){
    #my-panel {
        min-width: 100vw;
        min-height: calc(20vh + 56px);
        position: relative;
        padding:  0 0 20vh 0;
        overflow: visible;
    }
    #container {
    width: 100%;
    height: 80vh;
    
}
}
</style>