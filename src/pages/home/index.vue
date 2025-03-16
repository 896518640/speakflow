<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Description from "@@/components/Description.vue"
import Cell from "./components/Cell.vue"
import Title from "./components/Title.vue"
import { useAuth } from '@/common/composables/useAuth';
// @ts-ignore - 忽略类型检查错误
import RecognitionPanel from './components/RecognitionPanel.vue';
// @ts-ignore - 忽略类型检查错误
import FeatureCard from './components/FeatureCard.vue';
// @ts-ignore - 忽略类型检查错误
import ResultPanel from './components/ResultPanel.vue';

const router = useRouter();
const { isLoggedIn } = useAuth();

// 状态变量
const isRecording = ref(false);
const recognitionText = ref('');
const recordingStatus = ref('准备就绪');

// 录音控制
const toggleRecording = async () => {
  try {
    if (isRecording.value) {
      // 模拟停止录音
      isRecording.value = false;
      recordingStatus.value = '准备就绪';
    } else {
      // 模拟开始录音
      isRecording.value = true;
      recordingStatus.value = '正在识别...';
    }
  } catch (error) {
    console.error('录音操作失败', error);
  }
};

// 导航函数
const navigateToHistory = () => router.push('/history');
const navigateToTranslate = () => router.push('/translate');
const navigateToHelp = () => router.push('/help');
const navigateToProfile = () => router.push('/me');
</script>

<template>
  <div class="home-container">
    <!-- 顶部状态栏 -->
    <header class="header">
      <div class="status-bar">
        <h1 class="app-title">SpeakFlow</h1>
        <div class="user-profile" @click="navigateToProfile">
          <i class="user-icon" v-if="!isLoggedIn()"></i>
          <img v-else src="/logo.png" alt="用户头像" class="avatar" />
        </div>
      </div>
    </header>

    <!-- 主要功能区 -->
    <main class="main-content">
      <!-- 语音识别控制面板 -->
      <RecognitionPanel 
        :is-recording="isRecording" 
        :status="recordingStatus"
        @toggle="toggleRecording"
      />

      <!-- 快捷功能卡片 -->
      <section class="feature-cards">
        <FeatureCard 
          icon="translate" 
          title="实时翻译" 
          @click="navigateToTranslate" 
        />
        <FeatureCard 
          icon="sound" 
          title="语音识别" 
          @click="router.push('/rtasr')" 
        />
        <FeatureCard 
          icon="history" 
          title="历史记录" 
          @click="navigateToHistory" 
        />
      </section>

      <!-- 登录提示 -->
      <section v-if="!isLoggedIn()" class="login-prompt">
        <div class="prompt-content">
          <p>登录后即可使用所有功能</p>
          <router-link to="/login" class="login-button">
            立即登录
          </router-link>
        </div>
      </section>

      <!-- 识别结果展示 -->
      <ResultPanel 
        v-if="recognitionText" 
        :text="recognitionText"
        @copy="() => {}"
        @edit="() => {}"
        @clear="recognitionText = ''"
      />

      <!-- 功能列表 -->
      <section class="feature-list">
        <Title text="实用功能" />
        <div class="cells-wrapper">
          <Cell 
            title="语音识别（实时）" 
            path="/rtasr"
            un-mt-12px 
          />
          <Cell 
            title="翻译历史记录" 
            path="/history"
            un-mt-12px 
          />
          <Cell 
            title="使用帮助" 
            path="/help"
            un-mt-12px 
          />
          <Cell 
            title="关于我们" 
            path="/about"
            un-mt-12px 
          />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.header {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 22px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.user-profile {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-icon {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007AFF;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 20px; /* 为底部导航腾出空间 */
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.feature-list {
  margin-top: 24px;
}

.cells-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 12px;
}

.login-prompt {
  background: rgba(0, 122, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
}

.prompt-content {
  padding: 16px;
  text-align: center;
}

.prompt-content p {
  margin: 0 0 12px;
  color: #333;
}

.login-button {
  display: inline-block;
  padding: 8px 24px;
  background: #007AFF;
  color: white;
  border-radius: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.login-button:active {
  transform: scale(0.98);
  background: #0062cc;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #666;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item.active {
  color: #007AFF;
}

.nav-item:active {
  background: rgba(0, 0, 0, 0.05);
}

.nav-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
}

.nav-icon.home {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>');
}

.nav-icon.translate {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"></path><path d="M9 3v4"></path><path d="M4 11h2"></path><path d="M4 15h10"></path><rect x="12" y="3" width="8" height="7" rx="2"></rect><path d="m8 13-5 8h10z"></path></svg>');
}

.nav-icon.history {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>');
}

.nav-icon.profile {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>');
}

@media (max-width: 768px) {
  .feature-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .feature-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .main-content {
    padding: 16px;
    padding-bottom: 20px;
  }

  .header {
    padding: 12px 16px;
  }

  .app-title {
    font-size: 20px;
  }
}

/* 触摸反馈效果 */
@media (hover: hover) {
  .nav-item:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  .login-button:hover {
    background: #0062cc;
  }
}
</style>
