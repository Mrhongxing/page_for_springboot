// stores/navigationStore.ts
import { defineStore } from 'pinia';

interface TriggerInfo {
  from: string | null;
  action: string | null;
  data: any;
  timestamp: number | null;
}

export const useNavigationStore = defineStore('navigateStore', {
  state: (): TriggerInfo => ({
    from: null,
    action: null,
    data: null,
    timestamp: null
  }),
  
  getters: {
    // 判断是否需要触发（5分钟内有效）
    shouldTrigger: (state) => {
      if (!state.from || !state.timestamp) return false;
      const isValid = Date.now() - state.timestamp < 5 * 60 * 1000;
      return isValid;
    },
    
    triggerInfo: (state) => ({
      from: state.from,
      action: state.action,
      data: state.data
    })
  },
  
  actions: {
    // 设置触发信息
    setTrigger(from: string, action: string, data?: any) {
      this.from = from;
      this.action = action;
      this.data = data || null;
      this.timestamp = Date.now();
    },
    
    // 消费触发信息（获取后清除）
    consumeTrigger() {
      const info = {
        from: this.from,
        action: this.action,
        data: this.data
      };
      
      this.clearTrigger();
      return info;
    },
    
    // 清除触发信息
    clearTrigger() {
      this.from = null;
      this.action = null;
      this.data = null;
      this.timestamp = null;
    }
  },
  
  // 可选：持久化
  persist: {
    key: 'navigation-trigger',
    storage: sessionStorage,
    pick: ['from', 'action', 'data', 'timestamp']
  }
});