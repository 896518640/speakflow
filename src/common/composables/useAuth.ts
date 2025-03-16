/**
 * 统一的认证服务
 * 处理登录、注册、退出登录等操作
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/pinia/stores/user';
import { showToast, showSuccessToast, showNotify } from 'vant';
import { loginApi } from '@/pages/login/apis';

export function useAuth() {
  const router = useRouter();
  const userStore = useUserStore();
  const loading = ref(false);
  
  // 登录API调用
  const loginWithApi = async (username: string, password: string, redirectPath = '/') => {
    try {
      loading.value = true;
      const { data } = await loginApi({ username, password });
      
      showNotify({
        type: 'success',
        message: '登录成功',
        duration: 1500
      });
      
      userStore.setToken(data.token);
      
      // 获取用户信息
      await userStore.getInfo();
      
      // 添加延迟以显示成功通知
      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
      
      return true;
    } catch (error: any) {
      showNotify({
        type: 'danger',
        message: error?.message || '登录失败，请检查用户名和密码',
        duration: 2000
      });
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  // 退出登录
  const logout = () => {
    userStore.resetToken();
    showToast('已退出登录');
    
    // 跳转到首页
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  };
  
  // 检查是否已登录
  const isLoggedIn = () => {
    return userStore.isLoggedIn;
  };
  
  return {
    loading,
    loginWithApi,
    logout,
    isLoggedIn
  };
} 