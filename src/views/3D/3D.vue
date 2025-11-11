<template>
  <div class="virtual-fitting-room">
    <div class="canvas-container">
      <canvas ref="canvasRef"></canvas>
      
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>{{ loadingMessage }}</p>
        </div>
      </div>
    </div>

    <div class="control-panel">
      <h3>虚拟试衣间</h3>
      
      <!-- 调试信息 -->
      <div class="debug-section" v-if="debugInfo">
        <h4>调试信息</h4>
        <p>模型路径: {{ debugInfo.modelPath }}</p>
        <p>加载状态: {{ debugInfo.loadStatus }}</p>
      </div>

      <div class="control-section">
        <label>选择服装：</label>
        <select v-model="selectedClothing" @change="changeClothing">
          <option value="">请选择</option>
          <option value="t-shirt">T恤</option>
          <option value="dress">连衣裙</option>
          <option value="jacket">夹克</option>
          <option value="test-cube">测试立方体</option>
          <option value="悖谬-静聆潮韵">悖谬-静聆潮韵</option>
        </select>
      </div>

      <div class="control-section">
        <label>模特控制：</label>
        <input 
          type="range" 
          min="0" 
          max="360" 
          v-model="rotationY"
          @input="updateRotation"
          class="rotation-slider"
        >
        <span>{{ rotationY }}°</span>
      </div>

      <button @click="addTestCube" class="action-btn">添加测试立方体</button>
      <button @click="resetScene" class="action-btn">重置场景</button>
    </div>

    <div v-if="error" class="error-message">
      <strong>错误:</strong> {{ error }}
      <button @click="error = ''" class="close-btn">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const loadingMessage = ref('初始化3D场景...')
const error = ref('')
const selectedClothing = ref('')
const rotationY = ref(0)
const debugInfo = ref<any>(null)

// Three.js相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let humanModel: THREE.Group | null = null
let currentClothing: THREE.Object3D | null = null
let animationId: number

// 初始化Three.js场景
const initScene = () => {
  if (!canvasRef.value) {
    throw new Error('Canvas元素未找到')
  }

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xeeeeee)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 100, 100)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value,
    antialias: true 
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 添加坐标轴和网格辅助
  const axesHelper = new THREE.AxesHelper(2)
  scene.add(axesHelper)

  const gridHelper = new THREE.GridHelper(10, 10)
  scene.add(gridHelper)

  debugInfo.value = {
    modelPath: '',
    loadStatus: '场景初始化完成'
  }
}
// 新增：修复MMD FBX材质函数
const fixMMDMaterials = (model: THREE.Object3D) => {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const originalMaterial = child.material
      
      if (Array.isArray(originalMaterial)) {
        // 处理材质数组
        child.material = originalMaterial.map(mat => createFixedMaterial(mat))
      } else {
        // 处理单个材质
        child.material = createFixedMaterial(originalMaterial)
      }
    }
  })
}

// 新增：创建修复后的材质
const createFixedMaterial = (originalMaterial: THREE.Material): THREE.Material => {
  // 使用MeshStandardMaterial替代原有材质
  const fixedMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 基础颜色设为白色
    roughness: 0.7,   // 调整粗糙度
    metalness: 0.1,   // 调整金属度
    side: THREE.DoubleSide // 双面渲染
  })

  // 如果有贴图，尝试保留
  if (originalMaterial instanceof THREE.MeshPhongMaterial || 
      originalMaterial instanceof THREE.MeshLambertMaterial) {
    
    if (originalMaterial.map) {
      fixedMaterial.map = originalMaterial.map
      fixedMaterial.map.needsUpdate = true
    }
    
    if (originalMaterial.color) {
      fixedMaterial.color.copy(originalMaterial.color)
    }
    
    // 处理透明材质
    if (originalMaterial.transparent) {
      fixedMaterial.transparent = true
      fixedMaterial.opacity = originalMaterial.opacity
    }
  }

  return fixedMaterial
}
// 创建测试人体模型（备用方案）
const createTestHumanModel = (): THREE.Group => {
  const group = new THREE.Group()

  // 身体
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8)
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffcc99,
    roughness: 0.7 
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.75
  body.castShadow = true
  group.add(body)

  // 头部
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16)
  const headMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffcc99,
    roughness: 0.7 
  })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 1.75
  head.castShadow = true
  group.add(head)

  return group
}

// 加载人体模型（带备用方案）
const loadHumanModel = async (): Promise<void> => {
  return new Promise((resolve) => {
    const loader = new FBXLoader()
    // 用相对 URL（Vite/Web 打包友好），fallback 到 public 下的路径
    const modelPath = (() => {
        try {
            return new URL('../../models/cbjq/悖谬-静聆潮韵.fbx', import.meta.url).href
        } catch (e) {
            return '/models/cbjq/悖谬-静聆潮韵.fbx'
        }
    })()
    
    debugInfo.value = {
      modelPath: modelPath,
      loadStatus: '开始加载人体模型...'
    }

    loadingMessage.value = '加载人体模型中...'

    loader.load(
      modelPath,
      (fbx) => {
        humanModel = fbx
        humanModel.position.y = 0
        humanModel.scale.set(1, 1, 1)
        
        // 设置阴影
        humanModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        fixMMDMaterials(humanModel)
        scene.add(humanModel)// 添加到场景中
        debugInfo.value.loadStatus = '人体模型加载成功'
        resolve()
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100) || 0
        debugInfo.value.loadStatus = `加载中: ${Math.round(percent)}%`
        loadingMessage.value = `加载模型: ${Math.round(percent)}%`
      },
      (err) => {
        console.warn('无法加载人体模型文件，使用测试模型:', err)
        
        // 使用测试模型作为备用
        humanModel = createTestHumanModel()
        scene.add(humanModel)
        debugInfo.value.loadStatus = '使用测试人体模型'
        resolve()
      }
    )
  })
}

// 更换服装
const changeClothing = async () => {
  if (!selectedClothing.value) {
    removeCurrentClothing()
    return
  }

  // 如果是测试立方体
  if (selectedClothing.value === 'test-cube') {
    addTestCube()
    return
  }

  loadingMessage.value = '加载服装中...'
  
  try {
    removeCurrentClothing()

    const loader = new FBXLoader()
    const modelPath = (() => {
        try {
            return new URL(`../../models/try/${selectedClothing.value}.fbx`, import.meta.url).href
        } catch (e) {
            return `/models/try/${selectedClothing.value}.fbx`
        }
    })()
    
    debugInfo.value = {
      modelPath: modelPath,
      loadStatus: '开始加载服装...'
    }

    const fbx = await new Promise<THREE.Group>((resolve, reject) => {
      loader.load(
        modelPath,
        resolve,
        undefined,
        (error) => {
          // 如果服装加载失败，创建测试服装
          console.warn(`服装加载失败: ${error.message}`)
          const testClothing = createTestClothing(selectedClothing.value)
          resolve(testClothing)
        }
      )
    })

    currentClothing = fbx
    currentClothing.position.y = 100 // 根据人体模型调整位置

    fixMMDMaterials(currentClothing)
    
    // 添加到人体模型或场景
    if (humanModel) {
      humanModel.add(currentClothing)
    } else {
      scene.add(currentClothing)
    }

    // 设置阴影
    currentClothing.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    debugInfo.value.loadStatus = '服装加载完成'

  } catch (err) {
    console.error('加载服装时出错:', err)
    error.value = `加载服装失败: ${err}`
  } finally {
    loadingMessage.value = ''
  }
}

// 创建测试服装（备用方案）
const createTestClothing = (type: string): THREE.Group => {
  const group = new THREE.Group()
  let geometry: THREE.BufferGeometry
  let color: number

  switch (type) {
    case 't-shirt':
      geometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 8)
      color = 0xff0000
      break
    case 'dress':
      geometry = new THREE.ConeGeometry(0.6, 1.2, 8)
      color = 0x00ff00
      break
    case 'jacket':
      geometry = new THREE.BoxGeometry(0.8, 0.8, 0.3)
      color = 0x0000ff
      break
    default:
      geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      color = 0xffff00
  }

  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.8 
  })
  const clothing = new THREE.Mesh(geometry, material)
  clothing.position.y = type === 'dress' ? 0.6 : 1.0
  clothing.castShadow = true
  
  group.add(clothing)
  return group
}

// 添加测试立方体
const addTestCube = () => {
  removeCurrentClothing()
  
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,
    transparent: true,
    opacity: 0.7 
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0.5, 0)
  cube.castShadow = true
  
  currentClothing = cube
  scene.add(cube)
  
  selectedClothing.value = 'test-cube'
  debugInfo.value.loadStatus = '测试立方体已添加'
}

// 移除当前服装
const removeCurrentClothing = () => {
  if (currentClothing) {
    if (currentClothing.parent) {
      currentClothing.parent.remove(currentClothing)
    } else {
      scene.remove(currentClothing)
    }
    currentClothing = null
  }
}

// 更新旋转
const updateRotation = () => {
  if (humanModel) {
    humanModel.rotation.y = (rotationY.value * Math.PI) / 180
  }
}

// 重置场景
const resetScene = () => {
  selectedClothing.value = ''
  rotationY.value = 0
  if (humanModel) {
    humanModel.rotation.y = 0
  }
  removeCurrentClothing()
  debugInfo.value.loadStatus = '场景已重置'
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 组件挂载
onMounted(async () => {
  try {
    loadingMessage.value = '初始化3D场景...'
    initScene()
    
    loadingMessage.value = '加载人体模型中...'
    await loadHumanModel()
    
    animate()
    loading.value = false
    loadingMessage.value = ''
    
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('初始化失败:', err)
    error.value = `初始化失败: ${err}`
    loading.value = false
    loadingMessage.value = ''
  }
})

// 组件卸载
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  
  // 清理Three.js资源
  if (scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
  
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
:root{
    --bg: #f5f7fa;
    --panel-bg: #ffffff;
    --muted: #6b7280;
    --accent: #0b74de;
    --danger: #dc3545;
    --card: #eef2f7;
    --radius: 10px;
    --gap: 16px;
    --font-base: 16px;
}

/* 容器与整体字体 */
.virtual-fitting-room {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: "Helvetica Neue", Arial, sans-serif;
    font-size: var(--font-base);
    background: var(--bg);
    color: #111827;
    gap: var(--gap);
    box-sizing: border-box;
}

/* 画布区：更深背景方便观察模型，高对比 */
.canvas-container {
    flex: 1;
    position: relative;
    background: linear-gradient(180deg, #101319 0%, #1b2228 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

/* 画布铺满区域但保持像素比，清晰显示 */
.canvas-container canvas {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: optimizeQuality;
    background: transparent;
}

/* 加载层：半透明遮罩 + 更明显文字和更大的转圈 */
.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    z-index: 20;
    padding: 24px;
    text-align: center;
}

.loading-spinner {
    padding: 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(4px);
    min-width: 220px;
}

.spinner {
    border: 5px solid rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    border-top: 5px solid #fff;
    width: 56px;
    height: 56px;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 12px;
}

/* 控制面板：更宽、更高对比、内边距和圆角 */
.control-panel {
    width: 340px;
    max-width: 40%;
    padding: 22px;
    background: var(--panel-bg);
    border-left: 1px solid rgba(16,24,40,0.05);
    overflow-y: auto;
    box-shadow: -12px 0 40px rgba(2,6,23,0.12);
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
    box-sizing: border-box;
}

/* 标题 */
.control-panel h3 {
    margin: 0 0 12px 0;
    font-size: 1.25rem;
    letter-spacing: 0.2px;
    color: #0f172a;
}

/* 卡片式控制区 */
.control-section {
    margin-bottom: 16px;
    padding: 14px;
    background: var(--card);
    border-radius: 10px;
    box-sizing: border-box;
}

.control-section label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #0f172a;
    font-size: 0.95rem;
}

/* 调试信息：更清晰的配色与行高 */
.debug-section {
    margin-bottom: 16px;
    padding: 12px;
    background: linear-gradient(180deg,#fff7e6,#fffdf6);
    border: 1px solid #ffe6a7;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #3b2e00;
}

.debug-section h4 {
    margin: 0 0 8px 0;
    color: #5a4300;
    font-size: 0.95rem;
}

/* 表单控件更大更可触 */
select, .rotation-slider {
    width: 100%;
    height: 44px;
    padding: 8px 10px;
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 0.95rem;
    background: #fff;
    box-sizing: border-box;
}

/* Range 滑块更好交互（现代浏览器） */
.rotation-slider[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 44px;
}
.rotation-slider[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    background: linear-gradient(90deg, #dbeafe, #bfdbfe);
    border-radius: 8px;
}
.rotation-slider[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--accent);
    border-radius: 50%;
    margin-top: -5px;
    box-shadow: 0 2px 8px rgba(11,116,222,0.28);
}

/* 操作按钮：大号、易点击、有悬停反馈 */
.action-btn {
    width: 100%;
    padding: 14px;
    margin: 8px 0;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
    box-shadow: 0 6px 18px rgba(11,116,222,0.18);
}

.action-btn:hover {
    transform: translateY(-2px);
    background: #085ab8;
}

.action-btn:active {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(11,116,222,0.12);
}

/* 错误提示：置顶且易读 */
.error-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--danger);
    color: white;
    padding: 14px 18px;
    border-radius: 10px;
    z-index: 1001;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 30px rgba(220,53,69,0.25);
    font-weight: 600;
}

/* 关闭按钮更大 */
.close-btn {
    background: rgba(255,255,255,0.12);
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    padding: 6px;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 响应式：窄屏下把控制面板放到底部（便于手机查看） */
@media (max-width: 920px) {
    .virtual-fitting-room {
        flex-direction: column;
    }

    .control-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 100%;
        border-left: none;
        border-top-left-radius: 0;
        border-top-right-radius: var(--radius);
        box-shadow: 0 -8px 30px rgba(2,6,23,0.18);
        padding: 16px;
        transform: translateY(0);
    }

    .canvas-container {
        height: calc(100vh - 260px); /* 给控制面板留空间，按需调整 */
    }
}
</style>