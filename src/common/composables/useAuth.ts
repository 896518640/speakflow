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
  
  // 正式登录API调用
  const loginWithApi = async (username: "admin" | "editor", password: string, redirectPath = '/') => {
    try {
      loading.value = true;
      const { data } = await loginApi({ username, password });
      
      showNotify({
        type: 'success',
        message: '登录成功',
        duration: 1500
      });
      
      userStore.setToken(data.token);
      
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
  
  // 模拟登录（用于开发和测试）
  const mockLogin = async (username = '游客', redirectPath?: string) => {
    try {
      loading.value = true;
      const token = `mock-token-${username}-${Date.now()}`;
      
      // 保存token并获取用户信息
      userStore.setToken(token);
      
      // 延迟模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 获取用户信息（在实际应用中，这会由路由守卫或其他机制触发）
      userStore.getInfo();
      
      showSuccessToast('登录成功');
      
      // 如果指定了跳转路径，则导航到该路径
      if (redirectPath) {
        router.push(redirectPath);
      }
      
      return true;
    } catch (error) {
      showToast('登录失败，请稍后再试');
      console.error('Mock login error:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  // 模拟注册
  const mockRegister = async (username: string, email: string, password: string) => {
    try {
      loading.value = true;
      
      // 延迟模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccessToast('注册成功');
      
      // 注册成功后自动登录
      return await mockLogin(username);
    } catch (error) {
      showToast('注册失败，请稍后再试');
      console.error('Mock register error:', error);
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
    mockLogin,
    mockRegister,
    logout,
    isLoggedIn
  };
} 