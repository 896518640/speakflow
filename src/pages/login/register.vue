<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showNotify, showToast } from "vant";
import Description from "@/common/components/Description.vue";

const router = useRouter();
const loading = ref(false);
const showForm = ref(false);
const agreement = ref(false);
const cooldown = ref(0);
const timer = ref<number | undefined>(undefined);

// 表单数据
const formData = reactive({
  username: "",
  email: "",
  phone: "",
  code: "",
  password: "",
  confirmPassword: ""
});

// 表单验证
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

// 发送验证码
const sendCode = () => {
  if (!formData.phone) {
    showToast("请输入手机号码");
    return;
  }
  
  if (!validatePhone(formData.phone)) {
    showToast("请输入有效的手机号码");
    return;
  }
  
  // 模拟发送验证码
  showToast("验证码已发送");
  cooldown.value = 60;
  
  // 设置倒计时
  timer.value = window.setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = undefined;
      }
    }
  }, 1000);
};

// 提交注册表单
const onSubmit = () => {
  // 表单验证
  if (!formData.username.trim()) {
    showToast("请输入用户名");
    return;
  }
  
  if (!formData.email.trim()) {
    showToast("请输入邮箱");
    return;
  }
  
  if (!validateEmail(formData.email)) {
    showToast("请输入有效的邮箱地址");
    return;
  }
  
  if (!formData.phone.trim()) {
    showToast("请输入手机号码");
    return;
  }
  
  if (!validatePhone(formData.phone)) {
    showToast("请输入有效的手机号码");
    return;
  }
  
  if (!formData.code.trim()) {
    showToast("请输入验证码");
    return;
  }
  
  if (!formData.password) {
    showToast("请设置密码");
    return;
  }
  
  if (formData.password.length < 8) {
    showToast("密码长度不能少于8位");
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    showToast("两次密码输入不一致");
    return;
  }
  
  if (!agreement.value) {
    showToast("请阅读并同意用户协议和隐私政策");
    return;
  }
  
  loading.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    showNotify({
      type: 'success',
      message: '注册成功！',
      duration: 1500
    });
    
    setTimeout(() => {
      router.push("/login");
    }, 1000);
    
    loading.value = false;
  }, 1500);
};

// 返回登录页面
const goToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  setTimeout(() => {
    showForm.value = true;
  }, 300);
});
</script>

<template>
  <div class="register-container">
    <div class="glass-background"></div>
    <div class="register-content">
      <div class="header">
        <div class="back-button" @click="goToLogin">
          <van-icon name="arrow-left" size="20" />
        </div>
        <h1 class="page-title">注册账号</h1>
      </div>
      
      <Description class="description" />
      
      <transition name="fade-up">
        <form class="register-form" v-if="showForm" @submit.prevent="onSubmit">
          <div class="form-title">创建新账号</div>
          <p class="form-subtitle">填写以下信息完成注册</p>
          
          <van-cell-group inset class="form-group">
            <van-field
              v-model="formData.username"
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              required
              left-icon="user-o"
            />
            <van-field
              v-model="formData.email"
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              required
              left-icon="envelop-o"
            />
            <van-field
              v-model="formData.phone"
              name="phone"
              label="手机号码"
              placeholder="请输入手机号码"
              required
              left-icon="phone-o"
            />
            <van-field
              v-model="formData.code"
              name="code"
              label="验证码"
              placeholder="请输入验证码"
              required
              left-icon="shield-o"
            >
              <template #button>
                <van-button
                  size="small"
                  type="primary"
                  class="code-button"
                  :disabled="cooldown > 0"
                  @click="sendCode"
                >
                  {{ cooldown > 0 ? `${cooldown}s后重新发送` : '发送验证码' }}
                </van-button>
              </template>
            </van-field>
            <van-field
              v-model="formData.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请设置密码（不少于8位）"
              required
              left-icon="lock"
            />
            <van-field
              v-model="formData.confirmPassword"
              type="password"
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入密码"
              required
              left-icon="lock"
            />
          </van-cell-group>
          
          <div class="agreement">
            <van-checkbox v-model="agreement" shape="square" icon-size="16px">
              我已阅读并同意
              <a class="agreement-link">《用户协议》</a>
              和
              <a class="agreement-link">《隐私政策》</a>
            </van-checkbox>
          </div>
          
          <div class="buttons-wrapper">
            <van-button
              type="primary"
              native-type="submit"
              size="large"
              round
              block
              :loading="loading"
              class="submit-button"
            >
              {{ loading ? '注册中...' : '立即注册' }}
            </van-button>
            <div class="login-hint">
              已有账号？
              <router-link to="/login" class="login-link">立即登录</router-link>
            </div>
          </div>
        </form>
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
.register-container {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.glass-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    opacity: 0.4;
    filter: blur(80px);
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -80px;
  }
  
  &::after {
    width: 400px;
    height: 400px;
    bottom: -200px;
    right: -100px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
  }
}

.register-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
  text-align: center;
  max-height: 90vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.4);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
  
  .back-button {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(1.05);
    }
    
    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: #374151;
  }
}

.description {
  margin-bottom: 24px;
}

.register-form {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.8s ease-out;
  
  .form-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .form-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin-top: 0;
    margin-bottom: 24px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 24px;
    
    :deep(.van-cell) {
      background: rgba(255, 255, 255, 0.5);
      padding: 16px;
      transition: all 0.3s ease;
      
      &:focus-within {
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
      }
    }
    
    :deep(.van-field__label) {
      color: #4b5563;
      font-weight: 500;
    }
    
    :deep(.van-icon) {
      color: #6b7280;
    }
  }
  
  .agreement {
    margin-bottom: 24px;
    padding: 0 4px;
    text-align: left;
    
    :deep(.van-checkbox__label) {
      color: #4b5563;
      font-size: 14px;
    }
    
    :deep(.van-checkbox__icon--checked .van-icon) {
      background-color: #6366f1;
      border-color: #6366f1;
    }
    
    .agreement-link {
      color: #6366f1;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .buttons-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .submit-button {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      }
      
      &:active {
        transform: translateY(1px);
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
      }
    }
    
    .login-hint {
      font-size: 14px;
      color: #4b5563;
      
      .login-link {
        color: #6366f1;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .code-button {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    
    &:disabled {
      opacity: 0.6;
      background: #a5a6f6;
    }
  }
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式 */
@media (max-width: 480px) {
  .register-form {
    padding: 24px 16px;
  }
  
  .header {
    .page-title {
      font-size: 20px;
    }
  }
}
</style> 