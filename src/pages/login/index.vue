<script setup lang="ts">
import type { LoginRequestData } from "./apis/type"
import { useAuth } from "@/common/composables/useAuth"
import Description from "@@/components/Description.vue"
import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const { loading, loginWithApi } = useAuth()
const showForm = ref(false)
const rememberMe = ref(true)

// 获取要跳转的路径（如果有）
const redirectPath = route.query.redirect as string || '/'

// 表单引用，用于聚焦
const usernameField = ref<HTMLInputElement | null>(null)

const loginFormData: LoginRequestData = reactive({
  username: "admin",
  password: "12345678"
})

async function onSubmit() {
  await loginWithApi(loginFormData.username, loginFormData.password, redirectPath)
}

onMounted(() => {
  // 延迟显示表单，添加入场动画效果
  setTimeout(() => {
    showForm.value = true
    // 自动聚焦用户名输入框
    setTimeout(() => {
      usernameField.value?.focus()
    }, 500)
  }, 300)
})
</script>

<template>
  <div class="login-container">
    <div class="glass-background"></div>
    <div class="login-content">
      <div class="login-header">
        <div class="app-logo">
          <span class="logo-icon"></span>
        </div>
        <h1 class="app-name">智能语音助手</h1>
        <p class="app-slogan">语音识别 · 多语言支持 · 实时转写</p>
      </div>
      
      <transition name="fade-up">
        <van-form @submit="onSubmit" class="login-form" v-if="showForm">
          <div class="form-title">账号登录</div>
          
          <van-cell-group inset class="form-group">
            <van-field
              v-model="loginFormData.username"
              name="username"
              label="用户名"
              size="large"
              ref="usernameField"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
              left-icon="user-o"
            >
              <template #right-icon>
                <van-icon name="success" v-if="loginFormData.username" color="#6366f1" />
              </template>
            </van-field>
            
            <van-field
              v-model="loginFormData.password"
              type="password"
              name="password"
              label="密码"
              size="large"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              left-icon="lock"
            />
          </van-cell-group>
          
          <div class="remember-me">
            <van-checkbox v-model="rememberMe" shape="square" icon-size="16px">记住我</van-checkbox>
            <router-link to="/login/forgot-password" class="forgot-password">忘记密码?</router-link>
          </div>
          
          <div class="login-button-wrapper">
            <van-button
              :loading="loading"
              type="primary"
              native-type="submit"
              size="large"
              round
              block
              class="login-button"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </van-button>
          </div>
          
          <div class="additional-options">
            <span>没有账号？</span>
            <router-link to="/login/register" class="register-link">立即注册</router-link>
          </div>
        </van-form>
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
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

.login-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
  text-align: center;
}

.login-header {
  margin-bottom: 32px;
  
  .app-logo {
    width: 72px;
    height: 72px;
    margin: 0 auto 16px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: float 4s ease-in-out infinite;
    
    .logo-icon {
      position: relative;
      width: 32px;
      height: 32px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z' /%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  
  .app-name {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
  }
  
  .app-slogan {
    font-size: 14px;
    color: #4b5563;
    margin: 0;
    opacity: 0.8;
    font-weight: 500;
  }
}

.description {
  margin-bottom: 24px;
}

.login-form {
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
    margin-bottom: 24px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
    
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
  
  .remember-me {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 4px;
    
    :deep(.van-checkbox__label) {
      color: #4b5563;
      font-size: 14px;
    }
    
    :deep(.van-checkbox__icon--checked .van-icon) {
      background-color: #6366f1;
      border-color: #6366f1;
    }
    
    .forgot-password {
      font-size: 14px;
      color: #6366f1;
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .login-button-wrapper {
    margin-bottom: 20px;
    
    .login-button {
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
  }
  
  .additional-options {
    font-size: 14px;
    color: #4b5563;
    text-align: center;
    
    .register-link {
      color: #6366f1;
      font-weight: 500;
      margin-left: 4px;
      cursor: pointer;
      
      &:hover {
        text-decoration: underline;
      }
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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
  .login-form {
    padding: 24px 16px;
  }
  
  .login-header {
    .app-name {
      font-size: 24px;
    }
  }
}
</style>
