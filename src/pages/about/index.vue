<template>
  <div class="about-container">
    <div class="glass-background"></div>
    
    <div class="app-info">
      <div class="logo-container">
        <img src="/favicon.png" alt="SpeakFlow Logo" class="app-logo" />
      </div>
      <h1 class="app-name">SpeakFlow</h1>
      <p class="app-version">v1.0.0</p>
      <p class="app-slogan">实时语音翻译，畅所欲言</p>
    </div>
    
    <div class="about-content">
      <div class="section">
        <h2 class="section-title">关于SpeakFlow</h2>
        <p class="section-text">
          SpeakFlow是一款强大的实时语音翻译应用，它能够实时将您的语音转换为文字，并翻译成多种语言。
          我们的使命是打破语言障碍，让沟通变得更加简单和高效。
        </p>
      </div>
      
      <div class="section">
        <h2 class="section-title">技术支持</h2>
        <p class="section-text">
          SpeakFlow使用科大讯飞语音识别引擎，为您提供高精度的语音识别服务。
          我们支持中文、英语、日语、韩语、法语、西班牙语和俄语等多种语言。
        </p>
      </div>
      
      <div class="section">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-item">
          <van-icon name="envelop-o" />
          <span>support@speakflow.app</span>
        </div>
        
        <div class="contact-item">
          <van-icon name="weixin" />
          <span>SpeakFlow_Support</span>
        </div>
        
        <div class="contact-item">
          <van-icon name="github-o" />
          <span>github.com/speakflow/app</span>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">开发团队</h2>
        <p class="section-text">
          SpeakFlow由一支热爱技术、专注于语音识别和人工智能的团队开发。
          我们致力于提供最先进、最易用的语音翻译体验。
        </p>
      </div>
    </div>
    
    <div class="copyright">
      <p>© 2023-{{ new Date().getFullYear() }} SpeakFlow Team. All rights reserved.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue';

defineOptions({
  name: 'About',
});
</script>

<style lang="less" scoped>
.about-container {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  min-height: calc(100vh - 100px);
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
}

.app-info {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  margin-bottom: 16px;
}

.app-logo {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.app-version {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
}

.about-content {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.section {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 4px;
  }
}

.section-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 12px 0;
  
  .van-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #6366f1;
  }
  
  span {
    font-size: 14px;
    color: #4b5563;
  }
}

.copyright {
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  position: relative;
  z-index: 2;
}

@media (max-width: 480px) {
  .about-container {
    padding: 16px;
  }
  
  .about-content {
    padding: 16px;
  }
  
  .app-logo {
    width: 80px;
    height: 80px;
  }
  
  .app-name {
    font-size: 24px;
  }
}
</style> 