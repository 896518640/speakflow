<template>
  <div class="feature-card" @click="$emit('click')">
    <i class="feature-icon" :class="icon"></i>
    <span class="feature-title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

defineEmits(['click']);
</script>

<style scoped>
.feature-card {
  background: white;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.feature-card:active {
  transform: scale(0.97);
  background: #f8f8fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

/* 添加iOS风格的水波纹效果 */
.feature-card::after {
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
  border-radius: 12px;
}

.feature-card:active::after {
  opacity: 1;
  transform: scale(2);
}

.feature-icon {
  width: 32px;
  height: 32px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 4px;
  transition: transform 0.2s ease;
}

.feature-card:active .feature-icon {
  transform: scale(0.92);
}

.feature-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: color 0.2s ease;
}

/* 图标定义 */
.feature-icon.translate {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"></path><path d="M9 3v4"></path><path d="M4 11h2"></path><path d="M4 15h10"></path><rect x="12" y="3" width="8" height="7" rx="2"></rect><path d="m8 13-5 8h10z"></path></svg>');
}

.feature-icon.sound {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>');
}

.feature-icon.history {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>');
}

.feature-icon.summary {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>');
}

@media (hover: hover) {
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .feature-card:hover .feature-icon {
    transform: scale(1.05);
  }
}
</style> 