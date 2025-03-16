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
const currentTime = ref(new Date());
const showWelcome = ref(true);
const activeCategory = ref('all'); // 新增：选中的功能分类

// 定时更新当前时间
let timeInterval: number;

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
      // 隐藏欢迎界面
      showWelcome.value = false;
    }
  } catch (error) {
    console.error('录音操作失败', error);
  }
};

// 格式化时间
const formattedTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0');
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

// 获取问候语
const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
});

// 导航函数
const navigateToHistory = () => router.push('/history');
const navigateToTranslate = () => router.push('/translate');
const navigateToHelp = () => router.push('/help');
const navigateToProfile = () => router.push('/me');

// 设置功能分类
const setActiveCategory = (category: string) => {
  activeCategory.value = category;
};

onMounted(() => {
  // 每分钟更新一次时间
  timeInterval = window.setInterval(() => {
    currentTime.value = new Date();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<template>
  <div class="home-container" :class="{ 'recording-active': isRecording }">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 顶部状态栏 -->
    <header class="header">
      <div class="status-bar">
        <div class="left-side">
          <h1 class="app-title">SpeakFlow</h1>
          <span class="time-display">{{ formattedTime }}</span>
        </div>
        <div class="header-actions">
          <div class="search-btn" @click="router.push('/search')">
            <i class="search-icon"></i>
          </div>
          <div class="user-profile" @click="navigateToProfile">
            <i class="user-icon" v-if="!isLoggedIn()"></i>
            <img v-else src="/logo.png" alt="用户头像" class="avatar" />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要功能区 -->
    <main class="main-content">
      <!-- 欢迎界面 -->
      <section v-if="showWelcome && !isRecording" class="welcome-panel">
        <div class="welcome-banner">
          <h2 class="greeting">{{ greeting }}，<span v-if="isLoggedIn()">用户</span><span v-else>访客</span></h2>
          <p class="welcome-message">我随时准备好将您的声音转化为文字</p>
        </div>
        <div class="pulse-animation">
          <div class="pulse-circle"></div>
          <div class="pulse-circle"></div>
          <div class="pulse-circle"></div>
        </div>
        <button 
          class="start-button"
          @click="toggleRecording"
        >
          <i class="start-icon"></i>
          <span>开始录音</span>
        </button>
      </section>

      <!-- 语音识别控制面板 -->
      <RecognitionPanel 
        v-if="!showWelcome || isRecording"
        :is-recording="isRecording" 
        :status="recordingStatus"
        @toggle="toggleRecording"
      />

      <!-- 功能分类选择条 -->
      <section class="category-selector">
        <div 
          class="category-item" 
          :class="{ active: activeCategory === 'all' }"
          @click="setActiveCategory('all')"
        >
          所有功能
        </div>
        <div 
          class="category-item" 
          :class="{ active: activeCategory === 'voice' }"
          @click="setActiveCategory('voice')"
        >
          语音识别
        </div>
        <div 
          class="category-item" 
          :class="{ active: activeCategory === 'translate' }"
          @click="setActiveCategory('translate')"
        >
          翻译功能
        </div>
      </section>

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
          <svg class="lock-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <p>登录后即可使用所有功能</p>
            <router-link to="/login" class="login-button">
              立即登录
            </router-link>
          </div>
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

      <!-- 推荐功能 -->
      <section class="recommendation-section">
        <div class="section-header">
          <h3 class="section-title">推荐功能</h3>
          <span class="view-all" @click="router.push('/features')">查看全部</span>
        </div>
        <div class="recommendation-cards">
          <div class="recommendation-card" @click="router.push('/rtasr')">
            <div class="card-icon voice"></div>
            <div class="card-content">
              <h4>实时语音转文字</h4>
              <p>高精度识别，支持多种语言</p>
            </div>
          </div>
          <div class="recommendation-card" @click="navigateToTranslate">
            <div class="card-icon translate"></div>
            <div class="card-content">
              <h4>多语言翻译</h4>
              <p>支持30+种语言互译</p>
            </div>
          </div>
        </div>
      </section>

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
  position: relative;
  overflow: hidden;
  transition: background-color 0.5s ease;
}

.home-container.recording-active {
  background-color: #f0f5ff;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(64, 156, 255, 0.08));
  filter: blur(30px);
  transition: all 1s ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  opacity: 0.5;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: -150px;
  opacity: 0.3;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(88, 86, 214, 0.05));
}

.circle-3 {
  width: 250px;
  height: 250px;
  top: 40%;
  right: -80px;
  opacity: 0.4;
  background: linear-gradient(135deg, rgba(88, 86, 214, 0.06), rgba(0, 122, 255, 0.04));
}

.recording-active .circle-1 {
  transform: scale(1.2);
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.08), rgba(255, 149, 0, 0.05));
}

.recording-active .circle-2 {
  transform: scale(1.1) translate(30px, -20px);
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.05), rgba(255, 149, 0, 0.08));
}

.recording-active .circle-3 {
  transform: scale(1.15) translate(-20px, 10px);
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.06), rgba(255, 59, 48, 0.04));
}

.header {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-side {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.search-btn:active {
  transform: scale(0.95);
  background: rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="%23666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.app-title {
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.time-display {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  background: #f3f3f5;
  padding: 4px 8px;
  border-radius: 12px;
}

.user-profile {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-profile:active {
  transform: scale(0.92);
}

.user-icon {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #ffffff;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 70px; /* 为底部tabbar腾出空间 */
  position: relative;
  z-index: 1;
}

/* 功能分类选择器 */
.category-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.category-item {
  padding: 10px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  flex: 1;
}

.category-item.active {
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 122, 255, 0.2);
}

.category-item:active {
  transform: scale(0.98);
}

/* 欢迎面板 */
.welcome-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 24px;
  padding: 30px 24px;
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.welcome-banner {
  position: relative;
  z-index: 2;
}

.greeting {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.pulse-animation {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.pulse-circle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 122, 255, 0.3);
  animation: pulse 2s infinite;
}

.pulse-circle:nth-child(2) {
  animation-delay: 0.4s;
}

.pulse-circle:nth-child(3) {
  animation-delay: 0.8s;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.start-button {
  padding: 14px 36px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.3);
}

.start-button:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.start-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* 推荐功能部分 */
.recommendation-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.view-all {
  font-size: 14px;
  color: #007AFF;
  font-weight: 500;
  cursor: pointer;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.recommendation-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.recommendation-card:active {
  transform: scale(0.98);
  background-color: #fafafa;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon.voice {
  background: linear-gradient(135deg, #5856D6, #3634A3);
  position: relative;
}

.card-icon.voice::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.card-icon.translate {
  background: linear-gradient(135deg, #007AFF, #005BB5);
  position: relative;
}

.card-icon.translate::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"></path><path d="M9 3v4"></path><path d="M4 11h2"></path><path d="M4 15h10"></path><rect x="12" y="3" width="8" height="7" rx="2"></rect><path d="m8 13-5 8h10z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

.card-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.card-content p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.feature-list {
  margin-top: 24px;
}

.cells-wrapper {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-top: 12px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.login-prompt {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(88, 86, 214, 0.06));
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 122, 255, 0.1);
}

.prompt-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.lock-icon {
  flex-shrink: 0;
}

.prompt-content p {
  margin: 0 0 12px;
  color: #333;
  font-weight: 500;
}

.login-button {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
  border: none;
  outline: none;
}

.login-button:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #0062cc, #4645b2);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
}

@media (max-width: 768px) {
  .feature-cards {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .recommendation-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .feature-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .recommendation-cards {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 16px;
    padding-bottom: 70px; /* 为底部tabbar腾出空间 */
  }

  .header {
    padding: 12px 16px;
  }

  .app-title {
    font-size: 20px;
  }
  
  .greeting {
    font-size: 22px;
  }
  
  .welcome-panel {
    padding: 24px 20px;
  }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 触摸反馈效果 */
@media (hover: hover) {
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  .login-button:hover {
    background: linear-gradient(135deg, #0062cc, #4645b2);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.3);
  }
  
  .user-profile:hover {
    transform: scale(1.05);
  }
  
  .start-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
  }
  
  .recommendation-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  
  .search-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }
  
  .category-item:not(.active):hover {
    background: rgba(0, 0, 0, 0.03);
  }
}
</style>
