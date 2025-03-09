<template>
  <div class="voice-container" shadow="always">
    <div class="title-section">
      <h1 class="main-title">语音实时转文字</h1>
      <p class="subtitle">支持多语言 & 离线模式</p>
    </div>

    <div class="control-section">
      <van-button round size="large" type="primary" @click="toggleRecording">
        {{ isRecording ? '停止' : '按住说话' }}
      </van-button>

      <div class="controls">
        <audio-wave></audio-wave>
      </div>
    </div>

    <div class="result-section">
      <van-field v-model="translatedText" type="textarea" rows="8" placeholder="正在录音..." auto-resize class="transcript-area" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineOptions } from 'vue';
// import { useSpeechRecognition } from './useSpeechRecognition.ts';
import { useSpeechTranslation } from '@/hooks/useSpeechTranslation.ts';
import AudioWave from '@/common/components/AudioWave.vue';

defineOptions({
  name: 'stt',
})

const { 
  isRecording, 
  translatedText, 
  startRecording, 
  stopRecording,
} = useSpeechTranslation({
  sampleRate: 16000,
  bufferSize: 4096
});

// 组件方法
const toggleRecording = () => {
  console.log('toggleRecording', isRecording.value);
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

onMounted(() => {
  console.log('mounted');
});
</script>

<style lang="less" scoped>
.voice-container {
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.title-section {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 28px;
  font-weight: 600;
  color: #175199;
}

.subtitle {
  font-size: 16px;
  color: #646464;
  margin-top: 8px;
}

.control-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.mute-switch {
  margin-left: 16px;
}

.result-section {
  margin-bottom: 24px;
}

.transcript-area {
  height: 300px;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
}

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 480px) {
  .title-section {
    margin-bottom: 24px;
  }

  .control-section {
    flex-direction: column;
    align-items: stretch;
  }

  .mute-switch {
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>