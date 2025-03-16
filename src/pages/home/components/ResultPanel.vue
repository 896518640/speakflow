<template>
  <section class="result-panel">
    <div class="result-header">
      <h2 class="result-title">识别结果</h2>
      <div class="result-actions">
        <button class="action-btn" @click="$emit('copy')" title="复制">
          <i class="action-icon copy"></i>
        </button>
        <button class="action-btn" @click="$emit('edit')" title="编辑">
          <i class="action-icon edit"></i>
        </button>
        <button class="action-btn" @click="$emit('clear')" title="清除">
          <i class="action-icon delete"></i>
        </button>
      </div>
    </div>
    <div class="result-content">
      <p class="result-text">{{ text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  }
});

defineEmits(['copy', 'edit', 'clear']);
</script>

<style scoped>
.result-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition: box-shadow 0.3s ease;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.result-header::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05));
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
  position: relative;
}

.result-title::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 24px;
  height: 2px;
  background: #007AFF;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.action-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0) 70%);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
  border-radius: 8px;
}

.action-btn:active::after {
  opacity: 1;
  transform: scale(2);
}

.action-btn:active {
  transform: scale(0.9);
  background-color: rgba(0, 0, 0, 0.05);
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
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  background: #f8f8fa;
  border-radius: 12px;
  transition: background-color 0.3s ease;
  /* 添加iOS风格的滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
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

.result-text {
  margin: 0;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  animation: fadeIn 0.5s ease;
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .result-panel {
    padding: 16px;
  }
  
  .result-content {
    padding: 12px;
  }

  .action-icon {
    width: 20px;
    height: 20px;
  }
}

@media (hover: hover) {
  .action-btn:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  .action-btn:hover .action-icon {
    transform: scale(1.1);
  }
  
  .result-title:hover::before {
    width: 36px;
  }
}
</style> 