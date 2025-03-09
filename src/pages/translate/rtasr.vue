<template>
  <div class="voice-container">
    <div class="glass-background"></div>
    <div class="title-section">
      <h1 class="main-title">语音实时转文字</h1>
      <p class="subtitle">支持多语言 & 离线模式</p>
    </div>

    <!-- 服务和语言选择器 -->
    <service-selector
      :service-type="currentServiceTypeRef"
      :language="currentLanguage"
      @update:service-type="val => speechManager.serviceType.value = val"
      @update:language="val => speechManager.language.value = val"
    />

    <!-- 录音控制区域 -->
    <recording-control
      :is-recording="isRecording"
      :current-service-type="currentServiceType"
      :language="currentLanguage"
      @toggle-recording="toggleRecording"
    />


    <!-- 转写结果显示 -->
    <transcript-result
      :text="currentTranslatedText"
      :is-recording="isRecording"
      :error="currentError"
      :language="currentLanguage"
      @copy="handleTextCopied"
      @clear="clearText"
    />

    <!-- 浮动状态指示器 -->
    <recording-status
      :is-recording="isRecording"
      :seconds="currentSeconds"
      @stop-recording="stopRecording"
    />

  </div>
</template>

<script lang="ts" setup>
import { ref, defineOptions, watch, onMounted, computed } from 'vue';
import { showToast } from 'vant';
import { useSpeechRecognition } from '@/common/hooks/useSpeechRecognition';
import { useRecordingTimer } from '@/common/composables/useRecordingTimer';
import { useSpeechManager } from '@/common/composables/useSpeechManager';

// 导入子组件
import ServiceSelector from '@/common/components/voice/ServiceSelector.vue';
import RecordingControl from '@/common/components/voice/RecordingControl.vue';
import TranscriptResult from '@/common/components/voice/TranscriptResult.vue';
import RecordingStatus from '@/common/components/voice/RecordingStatus.vue';

defineOptions({
  name: 'RtAsr',
})

// 使用语音管理组合式函数
const speechManager = useSpeechManager();

// 使用录音计时器组合式函数
const timer = useRecordingTimer();

// 计算属性：解包 Ref 值
const currentLanguage = computed(() => speechManager.language.value);
const currentServiceTypeRef = computed(() => speechManager.serviceType.value);
const currentSeconds = computed(() => timer.seconds.value);
const currentError = computed<string>(() => error?.value?.toString() || '');
const currentTranslatedText = computed<string>(() => {
  if (typeof translatedText === 'string') {
    return translatedText;
  }
  return translatedText?.value || '';
});

// 使用语音识别 hook
const {
  isRecording,
  translatedText,
  error,
  startRecording,
  stopRecording,
  toggleRecording,
  clearText: clearTranslatedText,
  currentServiceType
} = useSpeechRecognition({
  sampleRate: 16000,
  bufferSize: 4096,
  serviceType: speechManager.serviceType,
  language: speechManager.language,
  serverUrl: import.meta.env.VITE_SPEECH_SERVER_URL || 'http://localhost:3000'
});

// 监听录音状态以控制计时器
watch(isRecording, (recording) => {
  if (recording) {
    timer.startTimer();
  } else {
    timer.stopTimer();
  }
});

// 监听服务类型变化
watch(speechManager.serviceType, (newType) => {
  console.log('Service type changed to:', newType);
});

// 监听语言变化
watch(speechManager.language, (newLanguage) => {
  console.log('Language changed to:', newLanguage);
});

// 清除文本
const clearText = () => {
  clearTranslatedText();
  showToast('文本已清除');
};

// 复制文本后的回调
const handleTextCopied = () => {
  console.log('文本已复制');
};

onMounted(() => {
  console.log('RTAsr component mounted');

  console.log('error', error)

  console.log('currentError', currentError)
});
</script>

<style lang="less" scoped>
.voice-container {
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.07));
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 42px rgba(31, 38, 135, 0.2);
  }
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

.title-section {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 24px;
  animation: fadeInDown 0.8s ease-out;
}

.main-title {
  font-size: 34px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 16px;
  color: #4b5563;
  margin-top: 8px;
  letter-spacing: 0.5px;
  position: relative;
  font-weight: 500;
  opacity: 0.9;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #175199, #4a90e2);
  border: none;
  padding: 12px 32px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(23, 81, 153, 0.2);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(23, 81, 153, 0.15);
  }
}

// Animations
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 媒体查询调整 */
@media (max-width: 480px) {
  .voice-container {
    padding: 24px;
    border-radius: 20px;
    margin: 16px;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
