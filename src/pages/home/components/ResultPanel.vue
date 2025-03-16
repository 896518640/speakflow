<template>
  <section class="result-panel">
    <div class="panel-background"></div>
    <div class="result-header">
      <div class="title-container">
        <h2 class="result-title">识别结果</h2>
        <span class="result-badge">文本</span>
      </div>
      <div class="result-actions">
        <button class="action-btn" @click="$emit('copy')" title="复制">
          <i class="action-icon copy"></i>
          <span class="tooltip">复制</span>
        </button>
        <button class="action-btn" @click="$emit('edit')" title="编辑">
          <i class="action-icon edit"></i>
          <span class="tooltip">编辑</span>
        </button>
        <button class="action-btn" @click="$emit('clear')" title="清除">
          <i class="action-icon delete"></i>
          <span class="tooltip">清除</span>
        </button>
      </div>
    </div>
    <div class="result-content">
      <div class="typing-container">
        <p class="result-text" ref="textElement">{{ text }}</p>
      </div>
      <div class="content-decoration">
        <svg class="wave-decoration" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0,0 Q25,10 50,0 T100,0 V20 H0 Z" fill="rgba(0, 122, 255, 0.03)"></path>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

defineEmits(['copy', 'edit', 'clear']);

// 文本打字效果
const textElement = ref<HTMLElement | null>(null);

// 监听文本变化，应用打字效果
watch(() => props.text, (newText) => {
  if (textElement.value) {
    applyTypingEffect(textElement.value, newText);
  }
});

onMounted(() => {
  if (textElement.value && props.text) {
    applyTypingEffect(textElement.value, props.text);
  }
});

function applyTypingEffect(element: HTMLElement, text: string) {
  // 如果文本很短，直接显示
  if (text.length < 20) {
    element.textContent = text;
    return;
  }
  
  // 否则应用打字效果
  element.textContent = '';
  let index = 0;
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, 10); // 极快的打字速度
    }
  }
  
  type();
}
</script>

<style scoped>
.result-panel {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition: all 0.4s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.panel-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: 20px 20px;
  background-image: 
    linear-gradient(to right, rgba(0, 122, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 122, 255, 0.03) 1px, transparent 1px);
  z-index: 0;
  opacity: 0.4;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.result-badge {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  padding: 3px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.2);
}

.result-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.5);
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.action-btn:active {
  transform: scale(0.92);
  background-color: rgba(0, 0, 0, 0.05);
}

.tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

.action-icon {
  width: 22px;
  height: 22px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.2s ease;
}

.action-btn:active .action-icon {
  transform: scale(0.9);
}

.action-icon.copy {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>');
}

.action-icon.edit {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>');
}

.action-icon.delete {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>');
}

.result-content {
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  transition: all 0.3s ease;
  /* 添加iOS风格的滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 1;
}

.result-content::-webkit-scrollbar {
  width: 6px;
}

.result-content::-webkit-scrollbar-track {
  background: transparent;
}

.result-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.typing-container {
  position: relative;
}

.result-text {
  margin: 0;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.content-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  overflow: hidden;
  pointer-events: none;
}

.wave-decoration {
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: -10px;
}

@keyframes slideUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .result-panel {
    padding: 20px;
  }
  
  .result-content {
    padding: 16px;
  }

  .action-icon {
    width: 20px;
    height: 20px;
  }
  
  .result-title {
    font-size: 18px;
  }
}

@media (hover: hover) {
  .result-panel:hover {
    box-shadow: 0 16px 40px rgba(0, 122, 255, 0.12);
    transform: translateY(-2px);
  }
  
  .action-btn:hover {
    background-color: rgba(0, 122, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .action-btn:hover .action-icon {
    transform: scale(1.1);
  }
}
</style> 