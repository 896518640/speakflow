<template>
  <section class="recognition-panel" :class="{ active: isRecording }">
    <div class="recognition-status" :class="{ active: isRecording }">
      <div class="wave-animation" v-if="isRecording">
        <canvas ref="waveCanvas" class="wave-canvas"></canvas>
        <div class="recording-indicator" aria-hidden="true">
          <span class="dot"></span>
          <span>录音中</span>
        </div>
      </div>
      <div v-else class="status-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
let audioPoints: number[] = [];

// 生成随机波形数据
const generatePoints = (count: number, height: number): number[] => {
  const points: number[] = [];
  const center = height / 2;
  const minHeight = height * 0.05;
  const maxHeight = height * 0.4;
  
  for (let i = 0; i < count; i++) {
    // 创建更自然的波形 - 结合正弦波和随机值
    const sinValue = Math.sin(i * 0.1) * maxHeight * 0.5;
    const rand = (Math.random() * maxHeight - maxHeight / 2) * 0.5;
    let amplitude = sinValue + rand + center;
    
    // 确保振幅在合理范围内
    amplitude = Math.max(center - maxHeight, Math.min(center + maxHeight, amplitude));
    points.push(amplitude);
  }
  
  return points;
};

// 更新波形数据 - 使波形动起来
const updatePoints = (points: number[], height: number): number[] => {
  const center = height / 2;
  const maxDiff = height * 0.05; // 每次更新的最大变化量
  
  return points.map(point => {
    const diff = (Math.random() * maxDiff * 2) - maxDiff;
    let newPoint = point + diff;
    
    // 确保点不会超出合理范围
    const maxDistance = height * 0.4;
    if (Math.abs(newPoint - center) > maxDistance) {
      newPoint = center + (Math.sign(newPoint - center) * maxDistance);
    }
    
    return newPoint;
  });
};

// 绘制波形动画
const drawWave = () => {
  if (!ctx || !waveCanvas.value) return;
  
  const width = waveCanvas.value.width;
  const height = waveCanvas.value.height;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  // 更新并绘制波形
  audioPoints = updatePoints(audioPoints, height);
  
  // 绘制波形填充
  const pointWidth = width / (audioPoints.length - 1);
  
  // 绘制填充区域
  ctx.beginPath();
  ctx.moveTo(0, height);
  
  audioPoints.forEach((point, index) => {
    const x = index * pointWidth;
    ctx.lineTo(x, point);
  });
  
  ctx.lineTo(width, height);
  ctx.closePath();
  
  // 创建渐变填充
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(0, 122, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 122, 255, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // 绘制波形线
  ctx.beginPath();
  audioPoints.forEach((point, index) => {
    const x = index * pointWidth;
    if (index === 0) {
      ctx!.moveTo(x, point);
    } else {
      ctx!.lineTo(x, point);
    }
  });
  
  ctx.strokeStyle = '#007AFF';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 绘制点
  audioPoints.forEach((point, index) => {
    const x = index * pointWidth;
    if (index % 3 === 0) { // 只绘制部分点，减少视觉混乱
      ctx.beginPath();
      ctx.arc(x, point, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#007AFF';
      ctx.fill();
    }
  });
  
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
    // 初始化音频点
    audioPoints = generatePoints(50, rect.height);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.recognition-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #007AFF, #5856D6);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.recognition-panel.active {
  box-shadow: 0 12px 40px rgba(0, 122, 255, 0.15);
}

.recognition-panel.active::before {
  opacity: 1;
}

.recognition-status {
  text-align: center;
  margin-bottom: 28px;
}

.wave-animation {
  height: 120px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-out;
  position: relative;
}

.recording-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 59, 48, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #FF3B30;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #FF3B30;
  border-radius: 50%;
  display: inline-block;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.status-icon {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  animation: float 3s infinite ease-in-out alternate;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-10px);
  }
}

.wave-canvas {
  width: 100%;
  height: 100%;
}

.status-text {
  font-size: 18px;
  color: #666;
  font-weight: 600;
  transition: all 0.3s ease;
  background: #f3f3f5;
  padding: 6px 16px;
  border-radius: 16px;
  display: inline-block;
}

.recognition-status.active .status-text {
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
}

.control-buttons {
  display: flex;
  justify-content: center;
}

.control-btn {
  padding: 14px 40px;
  border-radius: 24px;
  border: none;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.control-btn.recording {
  background: linear-gradient(135deg, #FF3B30, #FF9500);
  box-shadow: 0 6px 20px rgba(255, 59, 48, 0.3);
}

.control-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
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
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .recognition-panel {
    padding: 24px;
  }
  
  .wave-animation {
    height: 100px;
  }
  
  .status-icon {
    height: 100px;
  }
  
  .control-btn {
    padding: 12px 32px;
  }
}

@media (hover: hover) {
  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 122, 255, 0.4);
  }
  
  .control-btn.recording:hover {
    box-shadow: 0 10px 24px rgba(255, 59, 48, 0.4);
  }
}
</style> 