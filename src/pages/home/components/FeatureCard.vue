<template>
  <div class="feature-card" @click="$emit('click')">
    <div class="card-glow"></div>
    <div class="icon-container">
      <i class="feature-icon" :class="icon"></i>
    </div>
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
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9));
  border-radius: 16px;
  padding: 18px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(0, 122, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.8s ease, transform 0.8s ease;
  pointer-events: none;
  z-index: 0;
}

.feature-card:hover .card-glow {
  opacity: 1;
  transform: scale(1);
}

.icon-container {
  position: relative;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
  border-radius: 16px;
  margin-bottom: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.feature-card:active .icon-container {
  transform: scale(0.92);
}

.feature-icon {
  width: 28px;
  height: 28px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
}

.feature-card:active .feature-icon {
  transform: scale(0.92);
}

.feature-card:active {
  transform: scale(0.97);
  background: linear-gradient(145deg, rgba(245, 245, 245, 0.7), rgba(255, 255, 255, 0.9));
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
  z-index: 1;
}

/* 图标定义 */
.feature-icon.translate {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"></path><path d="M9 3v4"></path><path d="M4 11h2"></path><path d="M4 15h10"></path><rect x="12" y="3" width="8" height="7" rx="2"></rect><path d="m8 13-5 8h10z"></path></svg>');
}

.feature-icon.sound {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>');
}

.feature-icon.history {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>');
}

.feature-icon.summary {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="%23007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>');
}

@media (hover: hover) {
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 122, 255, 0.12);
  }
  
  .feature-card:hover .icon-container {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 122, 255, 0.12);
  }
  
  .feature-card:hover .feature-icon {
    transform: scale(1.05);
  }
  
  .feature-card:hover .feature-title {
    color: #007AFF;
  }
}
</style> 