<script setup lang="ts">
interface Props {
  text?: string;
  subtext?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: "SpeakFlow",
  subtext: "智能语音实时转写助手"
});
</script>

<template>
  <div class="brand-container">
    <div class="logo-wrapper">
      <img src="/logo.png" class="logo-image" alt="SpeakFlow Logo">
      <div class="logo-glow"></div>
    </div>
    
    <div class="brand-text">
      <h1 class="brand-name">{{ props.text }}</h1>
      <p class="brand-slogan">{{ props.subtext }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.brand-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(31, 38, 135, 0.12);
    
    .logo-glow {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
}

.logo-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    animation: pulse 3s infinite ease-in-out;
  }
  
  .logo-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    filter: blur(8px);
    opacity: 0.5;
    z-index: 1;
    transition: all 0.5s ease;
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
  text-align: left;
  
  .brand-name {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    background: linear-gradient(to right, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
  }
  
  .brand-slogan {
    font-size: 14px;
    color: #4b5563;
    margin: 4px 0 0;
    opacity: 0.9;
    font-weight: 500;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .brand-container {
    padding: 10px 14px;
  }
  
  .logo-wrapper {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
  
  .brand-text {
    .brand-name {
      font-size: 24px;
    }
    
    .brand-slogan {
      font-size: 12px;
    }
  }
}
</style>
