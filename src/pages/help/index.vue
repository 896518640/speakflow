<template>
  <div class="help-container">
    <div class="glass-background"></div>
    
    <div class="title-section">
      <h1 class="main-title">SpeakFlow 使用指南</h1>
      <p class="subtitle">实时语音翻译使用帮助</p>
    </div>
    
    <div class="guide-content">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="开始使用" name="start">
          <div class="guide-section">
            <p>欢迎使用 SpeakFlow 实时语音翻译应用！SpeakFlow 能够将您的语音实时转换为文字，并翻译成多种语言。</p>
            
            <h3>基本步骤</h3>
            <ol>
              <li>选择源语言（您说话的语言）</li>
              <li>选择目标语言（想要翻译成的语言）</li>
              <li>点击"按住说话"按钮开始录音</li>
              <li>说出您想翻译的内容</li>
              <li>系统会自动识别并翻译您的语音</li>
            </ol>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="语音识别服务" name="services">
          <div class="guide-section">
            <p>SpeakFlow 支持多种语音识别服务：</p>
            
            <h3>科大讯飞实时语音转写</h3>
            <p>实时流式识别，适合长时间说话，可以边说边看到转写结果。</p>
            
            <h3>科大讯飞语音听写</h3>
            <p>完整句子识别，需要说完整句子后才会显示结果，准确率较高。</p>
            
            <p class="tip">提示：在安静的环境下使用，可以提高识别准确率。</p>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="翻译功能" name="translation">
          <div class="guide-section">
            <p>SpeakFlow 支持多语言互译：</p>
            
            <h3>支持的语言</h3>
            <ul>
              <li>中文（简体）</li>
              <li>英语（美国）</li>
              <li>日语</li>
              <li>韩语</li>
              <li>法语</li>
              <li>西班牙语</li>
              <li>俄语</li>
            </ul>
            
            <h3>翻译设置</h3>
            <p>您可以在翻译设置中调整：</p>
            <ul>
              <li>目标语言</li>
              <li>是否自动翻译</li>
              <li>是否自动朗读翻译结果</li>
              <li>朗读速度</li>
            </ul>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="历史记录" name="history">
          <div class="guide-section">
            <p>SpeakFlow 会保存您的翻译历史记录，方便您随时查看和使用：</p>
            
            <h3>历史记录功能</h3>
            <ul>
              <li>查看全部历史记录</li>
              <li>收藏重要翻译</li>
              <li>复制、朗读和分享结果</li>
              <li>删除不需要的记录</li>
            </ul>
            
            <p class="note">注意：历史记录仅保存在本地设备，除非您登录账号同步。</p>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="离线模式" name="offline">
          <div class="guide-section">
            <p>SpeakFlow 支持离线模式，让您在没有网络的情况下也能使用部分功能：</p>
            
            <h3>离线功能</h3>
            <ul>
              <li>基本语音识别（部分语言）</li>
              <li>查看历史记录</li>
              <li>使用已保存的翻译</li>
            </ul>
            
            <p class="warn">注意：离线模式下，识别准确率和翻译功能可能受限。</p>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="常见问题" name="faq">
          <div class="guide-section">
            <h3>为什么语音识别不准确？</h3>
            <p>可能是因为环境噪音太大，或者说话不够清晰。尝试在安静的环境下，清晰缓慢地说话。</p>
            
            <h3>如何提高翻译质量？</h3>
            <p>尽量使用完整的句子，避免方言和生僻词。同时，您可以通过反馈功能帮助我们改进翻译质量。</p>
            
            <h3>如何分享翻译结果？</h3>
            <p>在翻译结果页面底部，点击"分享结果"按钮，可以将结果分享给好友或复制到剪贴板。</p>
            
            <h3>数据是否会上传到服务器？</h3>
            <p>语音识别和翻译需要通过服务器处理，但我们不会永久存储您的语音数据。历史记录默认只保存在本地。</p>
          </div>
        </van-collapse-item>
        
        <van-collapse-item title="联系我们" name="contact">
          <div class="guide-section">
            <p>如果您有任何问题、建议或反馈，欢迎联系我们：</p>
            
            <div class="contact-item">
              <van-icon name="envelop-o" />
              <span>support@speakflow.app</span>
            </div>
            
            <div class="contact-item">
              <van-icon name="weixin" />
              <span>SpeakFlow_Support</span>
            </div>
            
            <div class="contact-item">
              <van-icon name="github-o" />
              <span>github.com/speakflow/app</span>
            </div>
            
            <p class="thanks">感谢您使用 SpeakFlow！</p>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    
    <div class="app-version">
      <p>当前版本: v1.0.0</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineOptions } from 'vue';

defineOptions({
  name: 'Help',
});

const activeNames = ref(['start']);
</script>

<style lang="less" scoped>
.help-container {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 100px);
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
  font-size: 32px;
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

.guide-content {
  position: relative;
  z-index: 2;
  margin-top: 20px;
  
  :deep(.van-collapse) {
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
  }
  
  :deep(.van-collapse-item) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    
    .van-cell {
      background: transparent;
      padding: 16px;
      
      &::after {
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .van-cell__title {
        font-weight: 600;
        color: #374151;
        font-size: 16px;
      }
    }
    
    .van-collapse-item__content {
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      color: #4b5563;
    }
  }
}

.guide-section {
  line-height: 1.6;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 16px 0 8px;
  }
  
  p {
    margin: 8px 0;
    font-size: 14px;
    color: #4b5563;
  }
  
  ul, ol {
    padding-left: 24px;
    margin: 8px 0;
    
    li {
      margin-bottom: 4px;
      font-size: 14px;
    }
  }
  
  .tip {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 12px 0;
  }
  
  .note {
    background: rgba(59, 130, 246, 0.1);
    border-left: 4px solid #3b82f6;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 12px 0;
  }
  
  .warn {
    background: rgba(245, 158, 11, 0.1);
    border-left: 4px solid #f59e0b;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 12px 0;
  }
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 12px 0;
  
  .van-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #6366f1;
  }
  
  span {
    font-size: 14px;
  }
}

.thanks {
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
  color: #4b5563;
}

.app-version {
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  color: #6b7280;
  opacity: 0.7;
  position: relative;
  z-index: 2;
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

@media (max-width: 480px) {
  .help-container {
    padding: 16px;
  }
  
  .main-title {
    font-size: 26px;
  }
  
  .subtitle {
    font-size: 14px;
  }
}
</style> 