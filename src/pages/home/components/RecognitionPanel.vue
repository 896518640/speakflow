<template>
  <section class="recognition-panel">
    <div class="recognition-status" :class="{ active: isRecording }">
      <div class="wave-animation" v-if="isRecording">
        <canvas ref="waveCanvas" class="wave-canvas"></canvas>
      </div>
      <div v-else class="status-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </div>
      <div class="status-text">{{ status }}</div>
    </div>
    
    <div class="control-buttons">
      <button 
        class="control-btn start"
        :class="{ recording: isRecording }"
        @click="$emit('toggle')"
      >
        <i class="control-icon" :class="isRecording ? 'stop' : 'mic'"></i>
        {{ isRecording ? '停止识别' : '开始识别' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  isRecording: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: '准备就绪'
  }
});

const emit = defineEmits(['toggle']);

const waveCanvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;

// 绘制波形动画
const drawWave = () => {
  if (!ctx || !waveCanvas.value) return;
  
  const width = waveCanvas.value.width;
  const height = waveCanvas.value.height;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  // 绘制波形
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  
  // 简单的正弦波
  const now = Date.now() / 1000;
  for (let x = 0; x < width; x += 1) {
    const y = Math.sin(x * 0.02 + now * 5) * 20 + height / 2;
    ctx.lineTo(x, y);
  }
  
  ctx.strokeStyle = '#007AFF';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 循环动画
  animationFrameId = requestAnimationFrame(drawWave);
};

// 初始化画布
const initCanvas = () => {
  if (!waveCanvas.value) return;
  
  const canvas = waveCanvas.value;
  const dpr = window.devicePixelRatio || 1;
  
  // 设置canvas尺寸
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
};

// 启动动画
const startAnimation = () => {
  if (animationFrameId === null) {
    drawWave();
  }
};

// 停止动画
const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 监听录音状态变化
watch(() => props.isRecording, (newVal) => {
  if (newVal) {
    initCanvas();
    startAnimation();
  } else {
    stopAnimation();
  }
});

onMounted(() => {
  initCanvas();
  if (props.isRecording) {
    startAnimation();
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', initCanvas);
});

onUnmounted(() => {
  stopAnimation();
  window.removeEventListener('resize', initCanvas);
});
</script>

<style scoped>
.recognition-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.recognition-status {
  text-align: center;
  margin-bottom: 24px;
}

.wave-animation {
  height: 100px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-out;
}

.status-icon {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite ease-in-out alternate;
}

.wave-canvas {
  width: 100%;
  height: 100%;
}

.status-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  transition: color 0.3s ease;
}

.recognition-status.active .status-text {
  color: #007AFF;
}

.control-buttons {
  display: flex;
  justify-content: center;
}

.control-btn {
  padding: 12px 36px;
  border-radius: 24px;
  border: none;
  background: #007AFF;
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.control-btn.recording {
  background: #FF3B30;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

.control-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 按钮水波纹效果 */
.control-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
  border-radius: 24px;
}

.control-btn:active::after {
  opacity: 1;
  transform: scale(2);
}

.control-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.2s ease;
}

.control-btn:active .control-icon {
  transform: scale(0.9);
}

.control-icon.mic {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>');
}

.control-icon.stop {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>');
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.05); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .recognition-panel {
    padding: 20px;
  }
  
  .control-btn {
    padding: 10px 28px;
  }
}

@media (hover: hover) {
  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
  }
  
  .control-btn.recording:hover {
    box-shadow: 0 6px 16px rgba(255, 59, 48, 0.4);
  }
}
</style> 