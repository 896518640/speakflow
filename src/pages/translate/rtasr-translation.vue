<template>
  <div class="voice-container">
    <div class="glass-background"></div>
    
    <div class="title-section">
      <h1 class="main-title">语音实时翻译</h1>
      <p class="subtitle">边说边译 · 多语言支持</p>
    </div>

    <!-- 服务和语言选择器 -->
    <service-selector
      :service-type="currentServiceTypeRef"
      :language="currentLanguage"
      @update:service-type="val => speechManager.serviceType.value = val"
      @update:language="val => speechManager.language.value = val"
    />
    
    <!-- 翻译设置 -->
    <translation-selector
      :target-language="targetLanguage"
      :auto-translate="autoTranslate"
      :auto-speak="autoSpeak"
      :speech-rate="speechRate"
      @update:target-language="targetLanguage = $event"
      @update:auto-translate="autoTranslate = $event"
      @update:auto-speak="autoSpeak = $event"
      @update:speech-rate="speechRate = $event"
    />

    <!-- 录音控制区域 -->
    <recording-control
      :is-recording="isRecording"
      :current-service-type="currentServiceType"
      :language="currentLanguage"
      @toggle-recording="toggleRecording"
    />

    <!-- 原始文本和翻译结果显示 -->
    <div class="results-container">
      <!-- 原始语音识别文本 -->
      <transcript-result
        :text="currentTranslatedText"
        :is-recording="isRecording"
        :error="currentError"
        :language="currentLanguage"
        :title="getLanguageLabel(currentLanguage)"
        @copy="handleSourceTextCopied"
        @clear="clearText"
      />
      
      <!-- 翻译文本 -->
      <transcript-result
        v-if="targetLanguage !== currentLanguage"
        :text="translatedResult"
        :is-recording="isRecording"
        :error="translationError"
        :language="targetLanguage"
        :title="getLanguageLabel(targetLanguage)"
        :is-loading="isTranslating"
        :show-tts="true"
        @copy="handleTranslatedTextCopied"
        @clear="clearTranslatedResult"
        @tts="handleTTS"
      />
    </div>

    <!-- 浮动状态指示器 -->
    <recording-status
      :is-recording="isRecording"
      :seconds="currentSeconds"
      @stop-recording="stopRecording"
    />
    
    <!-- 翻译反馈按钮 -->
    <div class="feedback-container" v-if="translatedResult && targetLanguage !== currentLanguage">
      <div class="feedback-question">翻译质量如何？</div>
      <div class="feedback-buttons">
        <van-button 
          size="mini" 
          icon="good-job-o" 
          class="feedback-btn good-btn" 
          @click="handleFeedback('good')"
        >
          很好
        </van-button>
        <van-button 
          size="mini" 
          icon="discount" 
          class="feedback-btn ok-btn" 
          @click="handleFeedback('ok')"
        >
          一般
        </van-button>
        <van-button 
          size="mini" 
          icon="close" 
          class="feedback-btn bad-btn" 
          @click="handleFeedback('bad')"
        >
          较差
        </van-button>
      </div>
    </div>
    
    <!-- 共享和保存按钮 -->
    <div class="action-buttons" v-if="currentTranslatedText || translatedResult">
      <van-button 
        round 
        type="primary" 
        size="small" 
        icon="share-o"
        @click="shareResults"
      >
        分享结果
      </van-button>
      
      <van-button 
        round 
        plain 
        type="primary" 
        size="small" 
        icon="star-o"
        @click="saveToHistory"
      >
        保存到历史
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineOptions, watch, onMounted, computed } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import { useSpeechRecognition } from '@/common/hooks/useSpeechRecognition';
import { useRecordingTimer } from '@/common/composables/useRecordingTimer';
import { useSpeechManager } from '@/common/composables/useSpeechManager';
import { useTranslationService, supportedLanguages } from '@/common/composables/useTranslationService';
import { useSpeechToText } from '@/common/composables/useSpeechToText';
import { useUserStore } from '@/common/composables/useUserStore';

// 导入子组件
import ServiceSelector from '@/common/components/voice/ServiceSelector.vue';
import TranslationSelector from '@/common/components/voice/TranslationSelector.vue';
import RecordingControl from '@/common/components/voice/RecordingControl.vue';
import TranscriptResult from '@/common/components/voice/TranscriptResult.vue';
import RecordingStatus from '@/common/components/voice/RecordingStatus.vue';

defineOptions({
  name: 'RtasrTranslation',
})

// 使用语音管理组合式函数
const speechManager = useSpeechManager();

// 使用翻译服务
const { 
  isTranslating, 
  translatedText: translatedResult, 
  translationError, 
  translateText,
  getLanguageLabel
} = useTranslationService();

// 使用文字转语音服务
const speechToText = useSpeechToText();

// 使用用户存储
const userStore = useUserStore();

// 使用录音计时器组合式函数
const timer = useRecordingTimer();

// 翻译设置 - 添加默认值和安全检查
const targetLanguage = ref(userStore.profile?.preferences?.defaultTargetLanguage || 'en_us');
const autoTranslate = ref(userStore.profile?.preferences?.autoTranslate !== undefined ? userStore.profile.preferences.autoTranslate : true);
const autoSpeak = ref(userStore.profile?.preferences?.autoSpeak !== undefined ? userStore.profile.preferences.autoSpeak : false);
const speechRate = ref(userStore.profile?.preferences?.speechRate || 1);

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

// 清除翻译结果
const clearTranslatedResult = () => {
  translatedResult.value = '';
};

// 处理源文本复制
const handleSourceTextCopied = () => {
  navigator.clipboard.writeText(currentTranslatedText.value).then(() => {
    showToast('原文已复制到剪贴板');
  });
};

// 处理翻译文本复制
const handleTranslatedTextCopied = () => {
  navigator.clipboard.writeText(translatedResult.value).then(() => {
    showToast('译文已复制到剪贴板');
  });
};

// 处理文本朗读
const handleTTS = () => {
  if (translatedResult.value) {
    speechToText.speak(
      translatedResult.value, 
      targetLanguage.value, 
      { rate: speechRate.value }
    );
  }
};

// 清除文本
const clearText = () => {
  clearTranslatedText();
  clearTranslatedResult();
  showToast('文本已清除');
};

// 翻译质量反馈
const handleFeedback = (quality: 'good' | 'ok' | 'bad') => {
  // 这里应该是发送到服务器的逻辑
  console.log('翻译质量反馈:', quality);
  
  // 显示反馈消息
  let message = '';
  switch (quality) {
    case 'good':
      message = '感谢您的好评！';
      break;
    case 'ok':
      message = '感谢您的反馈，我们会继续改进';
      break;
    case 'bad':
      message = '抱歉带来不好的体验，我们会努力改进';
      break;
  }
  showSuccessToast(message);
};

// 分享结果
const shareResults = () => {
  const text = targetLanguage.value !== currentLanguage.value
    ? `${currentTranslatedText.value}\n${translatedResult.value}`
    : currentTranslatedText.value;
    
  if (navigator.share) {
    navigator.share({
      title: '语音翻译分享',
      text,
    }).catch(error => {
      console.error('分享失败:', error);
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
};

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板，可粘贴分享');
  });
};

// 保存到历史记录
const saveToHistory = () => {
  if (!currentTranslatedText.value) return;
  
  if (!userStore || typeof userStore.saveTranslation !== 'function') {
    showToast('保存功能暂不可用');
    return;
  }
  
  userStore.saveTranslation({
    sourceText: currentTranslatedText.value,
    translatedText: translatedResult.value || currentTranslatedText.value,
    sourceLanguage: currentLanguage.value,
    targetLanguage: targetLanguage.value,
  });
  
  showSuccessToast('已保存到历史记录');
};

// 监听录音状态以控制计时器
watch(isRecording, (recording) => {
  if (recording) {
    timer.startTimer();
  } else {
    timer.stopTimer();
  }
});

// 监听识别文本变化进行自动翻译
watch(currentTranslatedText, async (newText) => {
  if (autoTranslate.value && newText && targetLanguage.value !== currentLanguage.value) {
    await translateText(newText, currentLanguage.value, targetLanguage.value);
    
    // 如果设置了自动朗读，且有翻译结果
    if (autoSpeak.value && translatedResult.value) {
      speechToText.speak(
        translatedResult.value, 
        targetLanguage.value, 
        { rate: speechRate.value }
      );
    }
  }
});

// 存储用户偏好设置
watch([targetLanguage, autoTranslate, autoSpeak, speechRate], () => {
  userStore.updatePreferences({
    defaultTargetLanguage: targetLanguage.value,
    autoTranslate: autoTranslate.value,
    autoSpeak: autoSpeak.value,
    speechRate: speechRate.value
  });
});

onMounted(() => {
  console.log('RTAsr翻译组件已加载');
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

.results-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
}

.feedback-question {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
}

.feedback-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  
  &.good-btn {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  &.ok-btn {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  &.bad-btn {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  position: relative;
  z-index: 2;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #175199, #4a90e2);
  border: none;
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
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}
</style> 