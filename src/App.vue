<script setup lang="ts">
  import { compute } from 'three/tsl'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()
  const routerclass = computed(() => {
    const routerName = route.name?.toString()||'default'
    return `router-${routerName}`
  })

</script>
<template>
  <div class="nav-bar">
    <router-link to="/login">Go to Login Page</router-link>
    <router-link to="/3D">Go to Register Page</router-link>
  </div>
  <router-view :class="routerclass"/>
  <!-- 隐藏在视图外的SVG滤镜 -->
  <svg data-v-7a7a37b1 width="0" height="0" style="position: absolute; left: -9999px; top: -9999px;">
    <defs>
      <filter id="liquid_glass_filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="2" seed="7" result="noise"/>
        <feGaussianBlur in="noise" stdDeviation="1.2" result="map"/>
        <feDisplacementMap in="SourceGraphic" in2="map" scale="110" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>
</template>
<style scoped>
  .router-Login {
    background-color: #f0f8ff;
    height: 100vh;
    width: 100vw;
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  /* 导航栏（移动端为底部充满）*/}
  .nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 8px 12px;
    backdrop-filter: blur(4px) url(#liquid_glass_filter);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.06);
    z-index: 1000;
    border-radius: 0; /* 手机端两侧不圆角，充满底部 */
  }

  /* 链接样式 */
  .nav-bar a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    border-radius: 12px;
    transition: background-color 0.15s ease, transform 0.12s ease;
  }
  .nav-bar a:hover {
    background: rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }
  .nav-bar a.router-link-active {
    backdrop-filter: blur(4px) url(#liquid_glass_filter);
    background: rgba(255, 255, 255, 0.1);
    color: #1f3a93;
  }

  /* 桌面端：底部居中，两端圆角 */
  @media (min-width: 768px) {
    .nav-bar {
      left: 50%;
      transform: translateX(-50%);
      width: min(560px, 90%); /* 居中并限制最大宽度 */
      bottom: 24px;          /* 离底部有间距 */
      padding: 10px 18px;
      border-radius: 28px;   /* 两端圆角 */
      box-shadow: 0 10px 30px rgba(20, 30, 40, 0.12);
    }
  }
  .router-3D {
    background-color: #fff0f5;
    height: 100vh;
    width: 100vw;
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
  }

</style>
