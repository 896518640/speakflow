<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showNotify, showToast } from "vant";
import Description from "@/common/components/Description.vue";

const router = useRouter();
const loading = ref(false);
const showForm = ref(false);
const cooldown = ref(0);
const timer = ref<number | undefined>(undefined);

// 步骤控制
const step = ref(1); // 1:输入邮箱/手机 2:验证码 3:重置密码

// 表单数据
const formData = reactive({
  username: "",
  code: "",
  password: "",
  confirmPassword: ""
});

// 发送验证码
const sendCode = () => {
  if (!formData.username) {
    showToast("请输入邮箱或手机号码");
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

// 验证码表单提交
const verifyCode = () => {
  if (!formData.code) {
    showToast("请输入验证码");
    return;
  }
  
  // 模拟验证码验证
  step.value = 3;
  showToast("验证码验证成功");
};

// 重置密码表单提交
const resetPassword = () => {
  if (!formData.password) {
    showToast("请输入新密码");
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
  
  loading.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    showNotify({
      type: 'success',
      message: '密码重置成功！',
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
  <div class="forgot-container">
    <div class="glass-background"></div>
    <div class="forgot-content">
      <div class="header">
        <div class="back-button" @click="goToLogin">
          <van-icon name="arrow-left" size="20" />
        </div>
        <h1 class="page-title">找回密码</h1>
      </div>
      
      <Description class="description" />
      
      <transition name="fade-up">
        <div class="forgot-form" v-if="showForm">
          <!-- 步骤1: 输入邮箱/手机 -->
          <template v-if="step === 1">
            <div class="form-title">重置密码</div>
            <p class="form-subtitle">请输入您注册时使用的邮箱或手机号码</p>
            
            <van-cell-group inset class="form-group">
              <van-field
                v-model="formData.username"
                name="username"
                label="邮箱/手机"
                placeholder="请输入邮箱或手机号码"
                :rules="[{ required: true, message: '请输入邮箱或手机号码' }]"
                left-icon="envelop-o"
              />
            </van-cell-group>
            
            <div class="buttons-wrapper">
              <van-button
                type="primary"
                size="large"
                round
                block
                class="submit-button"
                @click="sendCode"
              >
                发送验证码
              </van-button>
              <van-button
                plain
                type="primary"
                size="large"
                round
                block
                class="back-button"
                @click="goToLogin"
              >
                返回登录
              </van-button>
            </div>
          </template>
          
          <!-- 步骤2: 验证码 -->
          <template v-if="step === 2">
            <div class="form-title">输入验证码</div>
            <p class="form-subtitle">验证码已发送至 {{ formData.username }}</p>
            
            <van-cell-group inset class="form-group">
              <van-field
                v-model="formData.code"
                name="code"
                label="验证码"
                placeholder="请输入验证码"
                :rules="[{ required: true, message: '请输入验证码' }]"
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
                    {{ cooldown > 0 ? `${cooldown}s后重新发送` : '重新发送' }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            
            <div class="buttons-wrapper">
              <van-button
                type="primary"
                size="large"
                round
                block
                class="submit-button"
                @click="verifyCode"
              >
                验证
              </van-button>
              <van-button
                plain
                type="primary"
                size="large"
                round
                block
                class="back-button"
                @click="step = 1"
              >
                上一步
              </van-button>
            </div>
          </template>
          
          <!-- 步骤3: 重置密码 -->
          <template v-if="step === 3">
            <div class="form-title">设置新密码</div>
            <p class="form-subtitle">请设置一个新的密码</p>
            
            <van-cell-group inset class="form-group">
              <van-field
                v-model="formData.password"
                type="password"
                name="password"
                label="新密码"
                placeholder="请输入新密码"
                :rules="[{ required: true, message: '请输入新密码' }]"
                left-icon="lock"
              />
              <van-field
                v-model="formData.confirmPassword"
                type="password"
                name="confirmPassword"
                label="确认密码"
                placeholder="请再次输入新密码"
                :rules="[{ required: true, message: '请再次输入新密码' }]"
                left-icon="lock"
              />
            </van-cell-group>
            
            <div class="buttons-wrapper">
              <van-button
                type="primary"
                size="large"
                round
                block
                class="submit-button"
                :loading="loading"
                @click="resetPassword"
              >
                {{ loading ? '提交中...' : '重置密码' }}
              </van-button>
              <van-button
                plain
                type="primary"
                size="large"
                round
                block
                class="back-button"
                @click="step = 2"
              >
                上一步
              </van-button>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="less" scoped>
.forgot-container {
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

.forgot-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
  text-align: center;
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

.forgot-form {
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
  
  .buttons-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
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
    
    .back-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-color: #6366f1;
      color: #6366f1;
      
      &:hover {
        background-color: rgba(99, 102, 241, 0.05);
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
  .forgot-form {
    padding: 24px 16px;
  }
  
  .header {
    .page-title {
      font-size: 20px;
    }
  }
}
</style> 