<script lang="ts" setup>
import { ref, defineOptions, computed } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import { useUserStore } from '@/pinia/stores/user';
import { useDark } from '@@/composables/useDark';
import { useAuth } from '@/common/composables/useAuth';
import { supportedLanguages } from '@/common/composables/useTranslationService';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'Me',
});

// 路由
const router = useRouter();
const userStore = useUserStore();
const { isDark, setDarkMode } = useDark();
const { loading: authLoading, mockLogin, mockRegister, logout } = useAuth();

// 弹窗控制
const showLoginPopup = ref(false);
const showSettings = ref(false);
const activeTab = ref(0);

// 登录表单
const loginForm = ref({
  email: '',
  password: '',
});

// 注册表单
const registerForm = ref({
  username: '',
  email: '',
  password: '',
});

// 设置选项
const darkMode = computed({
  get: () => isDark.value,
  set: (value) => setDarkMode(value)
});
const defaultSourceLanguage = ref(userStore.profile?.preferences?.defaultSourceLanguage || 'zh_cn');
const defaultTargetLanguage = ref(userStore.profile?.preferences?.defaultTargetLanguage || 'en_us');
const autoTranslate = ref(userStore.profile?.preferences?.autoTranslate !== undefined ? userStore.profile.preferences.autoTranslate : true);
const autoSpeak = ref(userStore.profile?.preferences?.autoSpeak !== undefined ? userStore.profile.preferences.autoSpeak : false);
const speechRate = ref(userStore.profile?.preferences?.speechRate || 1);

// 语言选项
const languageOptions = computed(() => 
  supportedLanguages.map(lang => ({
    text: lang.label,
    value: lang.code,
  }))
);

// 登录处理
const handleLogin = async () => {
  // 调用统一的认证服务
  await mockLogin(loginForm.value.email.split('@')[0] || '用户');
  showLoginPopup.value = false;
};

// 注册处理
const handleRegister = async () => {
  // 调用统一的认证服务
  await mockRegister(
    registerForm.value.username,
    registerForm.value.email,
    registerForm.value.password
  );
  showLoginPopup.value = false;
};

// 退出登录
const handleLogout = () => {
  logout();
};

// 保存设置
const saveSettings = () => {
  userStore.updatePreferences({
    defaultSourceLanguage: defaultSourceLanguage.value,
    defaultTargetLanguage: defaultTargetLanguage.value,
    autoTranslate: autoTranslate.value,
    autoSpeak: autoSpeak.value,
    speechRate: speechRate.value,
  });
  
  showSuccessToast('设置已保存');
  showSettings.value = false;
};

// 离线包管理
const handleOfflinePackages = () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录');
    return;
  }
  showToast('离线包功能即将上线');
};

// 语音定制
const handleVoiceCustomization = () => {
  if (!userStore.isLoggedIn) {
    showToast('请先登录');
    return;
  }
  showToast('语音定制功能即将上线');
};

// 导出数据
const handleExportData = () => {
  if (!userStore.translationHistory || userStore.translationHistory.length === 0) {
    showToast('暂无数据可导出');
    return;
  }
  
  // 创建导出数据
  const exportData = {
    history: userStore.translationHistory,
    exportTime: new Date().toISOString(),
    user: userStore.isLoggedIn ? {
      username: userStore.profile?.username || '游客',
      email: userStore.profile?.email || '',
    } : { username: '游客' },
  };
  
  // 转换为JSON
  const dataStr = JSON.stringify(exportData, null, 2);
  
  // 创建下载链接
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  const exportFileName = `speakflow_export_${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
  
  showSuccessToast('数据导出成功');
};

// 分享应用
const handleShareApp = () => {
  const shareData = {
    title: 'SpeakFlow - 实时语音翻译',
    text: '推荐一个好用的实时语音翻译应用，边说边译，多语言支持！',
    url: window.location.origin,
  };
  
  if (navigator.share) {
    navigator.share(shareData)
      .catch((error) => {
        console.error('分享失败:', error);
        copyShareLink();
      });
  } else {
    copyShareLink();
  }
};

// 复制分享链接
const copyShareLink = () => {
  navigator.clipboard.writeText(window.location.origin)
    .then(() => {
      showToast('链接已复制，可以分享给好友了');
    })
    .catch(() => {
      showToast('复制失败，请手动复制浏览器地址');
    });
};

// 检查更新
const checkUpdate = () => {
  showToast('当前已是最新版本 v1.0.0');
};

// 快速登录（游客）
const handleQuickLogin = async () => {
  // 调用统一的认证服务
  await mockLogin('游客');
  showLoginPopup.value = false;
};
</script>

<template>
  <div class="me-container">
    <div class="glass-background"></div>
    
    <!-- 用户信息区 -->
    <div class="user-profile-card">
      <template v-if="userStore.isLoggedIn">
        <!-- 已登录状态 -->
        <div class="avatar-section">
          <van-image
            round
            width="80"
            height="80"
            :src="userStore.profile.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
            fit="cover"
          />
          <div class="user-badge" v-if="userStore.profile.isPremium">
            <van-icon name="diamond-o" />
            <span>高级会员</span>
          </div>
        </div>
        
        <div class="user-info">
          <h2 class="username">{{ userStore.profile.username }}</h2>
          <p class="email">{{ userStore.profile.email }}</p>
        </div>
        
        <div class="action-buttons">
          <van-button size="small" plain type="primary" icon="setting-o" @click="showSettings = true">
            设置
          </van-button>
          <van-button size="small" plain type="danger" icon="cross" @click="handleLogout">
            退出登录
          </van-button>
        </div>
      </template>
      
      <template v-else>
        <!-- 未登录状态 -->
        <div class="avatar-section">
          <van-image
            round
            width="80"
            height="80"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            fit="cover"
          />
        </div>
        
        <div class="user-info">
          <h2 class="username">游客</h2>
          <p class="login-tip">登录后享受更多功能</p>
        </div>
        
        <div class="action-buttons">
          <van-button size="small" type="primary" icon="friends-o" @click="showLoginPopup = true">
            登录 / 注册
          </van-button>
        </div>
      </template>
    </div>
    
    <!-- 功能菜单 -->
    <div class="feature-section">
      <van-cell-group inset title="基本功能" :border="false">
        <van-cell title="翻译历史" icon="clock-o" is-link to="/history" />
        <van-cell title="收藏记录" icon="star-o" is-link to="/history?tab=1" />
        <van-cell title="使用帮助" icon="question-o" is-link to="/help" />
      </van-cell-group>
      
      <van-cell-group inset title="高级功能" :border="false">
        <van-cell 
          title="离线包管理" 
          icon="down" 
          is-link 
          :class="{ 'disabled-cell': !userStore.isLoggedIn }"
          @click="handleOfflinePackages"
        />
        <van-cell 
          title="语音定制" 
          icon="music-o" 
          is-link 
          :class="{ 'disabled-cell': !userStore.isLoggedIn }"
          @click="handleVoiceCustomization"
        />
        <van-cell 
          title="导出全部数据" 
          icon="exchange" 
          is-link 
          @click="handleExportData"
        />
      </van-cell-group>
      
      <van-cell-group inset title="其他" :border="false">
        <van-cell title="关于我们" icon="info-o" is-link to="/about" />
        <van-cell title="分享应用" icon="share-o" is-link @click="handleShareApp" />
        <van-cell title="检查更新" icon="upgrade" is-link @click="checkUpdate" />
      </van-cell-group>
    </div>
    
    <!-- 底部版权信息 -->
    <div class="app-footer">
      <p>SpeakFlow &copy; 2023-{{ new Date().getFullYear() }}</p>
      <p>Real-time Speech Translation</p>
    </div>
    
    <!-- 登录弹窗 -->
    <van-popup 
      v-model:show="showLoginPopup" 
      closeable 
      position="bottom" 
      :style="{ height: '70%' }"
      round
    >
      <div class="login-popup">
        <h2 class="popup-title">欢迎使用 SpeakFlow</h2>
        
        <van-tabs v-model:active="activeTab">
          <van-tab title="登录">
            <van-form @submit="handleLogin">
              <van-cell-group inset>
                <van-field
                  v-model="loginForm.email"
                  name="email"
                  label="邮箱"
                  placeholder="请输入邮箱"
                  :rules="[{ required: true, message: '请填写邮箱' }]"
                />
                <van-field
                  v-model="loginForm.password"
                  type="password"
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
                />
              </van-cell-group>
              <div class="form-actions">
                <van-button round block type="primary" native-type="submit">
                  登录
                </van-button>
              </div>
            </van-form>
          </van-tab>
          
          <van-tab title="注册">
            <van-form @submit="handleRegister">
              <van-cell-group inset>
                <van-field
                  v-model="registerForm.username"
                  name="username"
                  label="用户名"
                  placeholder="请输入用户名"
                  :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                  v-model="registerForm.email"
                  name="email"
                  label="邮箱"
                  placeholder="请输入邮箱"
                  :rules="[{ required: true, message: '请填写邮箱' }]"
                />
                <van-field
                  v-model="registerForm.password"
                  type="password"
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请填写密码' }]"
                />
              </van-cell-group>
              <div class="form-actions">
                <van-button round block type="primary" native-type="submit">
                  注册
                </van-button>
              </div>
            </van-form>
          </van-tab>
        </van-tabs>
        
        <div class="social-login">
          <p class="divider">社交账号登录</p>
          <div class="social-buttons">
            <van-button icon="wechat" round plain />
            <van-button icon="weibo" round plain />
            <van-button icon="google" round plain />
          </div>
        </div>
      </div>
    </van-popup>
    
    <!-- 设置弹窗 -->
    <van-popup 
      v-model:show="showSettings" 
      closeable 
      position="bottom" 
      :style="{ height: '70%' }"
      round
    >
      <div class="settings-popup">
        <h2 class="popup-title">应用设置</h2>
        
        <van-cell-group inset title="常规设置">
          <van-cell title="深色模式">
            <template #right-icon>
              <van-switch v-model="darkMode" size="24" />
            </template>
          </van-cell>
          <van-cell title="默认源语言">
            <template #right-icon>
              <van-dropdown-menu :overlay="false" active-color="#175199">
                <van-dropdown-item v-model="defaultSourceLanguage" :options="languageOptions" />
              </van-dropdown-menu>
            </template>
          </van-cell>
          <van-cell title="默认目标语言">
            <template #right-icon>
              <van-dropdown-menu :overlay="false" active-color="#175199">
                <van-dropdown-item v-model="defaultTargetLanguage" :options="languageOptions" />
              </van-dropdown-menu>
            </template>
          </van-cell>
        </van-cell-group>
        
        <van-cell-group inset title="翻译设置">
          <van-cell title="自动翻译">
            <template #right-icon>
              <van-switch v-model="autoTranslate" size="24" />
            </template>
          </van-cell>
          <van-cell title="自动朗读翻译">
            <template #right-icon>
              <van-switch v-model="autoSpeak" size="24" />
            </template>
          </van-cell>
          <van-cell title="朗读速度">
            <template #right-icon>
              <van-stepper v-model="speechRate" :min="0.5" :max="2" :step="0.1" />
            </template>
          </van-cell>
        </van-cell-group>
        
        <div class="settings-actions">
          <van-button block type="primary" @click="saveSettings">
            保存设置
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.me-container {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  min-height: calc(100vh - 50px);
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

.user-profile-card {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.avatar-section {
  position: relative;
  margin-bottom: 16px;
}

.user-badge {
  position: absolute;
  bottom: 0;
  right: -10px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  
  .van-icon {
    font-size: 14px;
    margin-right: 4px;
  }
}

.user-info {
  margin-bottom: 20px;
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.email {
  font-size: 14px;
  color: #6b7280;
}

.login-tip {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.feature-section {
  position: relative;
  z-index: 2;
  margin-bottom: 24px;
  
  :deep(.van-cell-group__title) {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 8px;
    padding-left: 16px;
  }
  
  :deep(.van-cell-group--inset) {
    margin: 0 0 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
  }
  
  :deep(.van-cell) {
    background: transparent;
    
    &::after {
      border-color: rgba(255, 255, 255, 0.05);
    }
    
    .van-cell__title {
      color: #374151;
    }
    
    .van-icon {
      color: #6366f1;
    }
  }
  
  .disabled-cell {
    opacity: 0.6;
    
    :deep(.van-cell__title) {
      color: #9ca3af;
    }
  }
}

.app-footer {
  text-align: center;
  padding: 24px 0;
  color: #9ca3af;
  font-size: 12px;
  position: relative;
  z-index: 2;
  
  p {
    margin: 2px 0;
  }
}

.login-popup {
  padding: 24px;
  
  .popup-title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 24px;
  }
  
  :deep(.van-tabs__nav) {
    background: transparent;
  }
  
  .form-actions {
    margin-top: 24px;
  }
  
  .social-login {
    margin-top: 32px;
    
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #e5e7eb;
      }
      
      &::before {
        margin-right: 10px;
      }
      
      &::after {
        margin-left: 10px;
      }
    }
    
    .social-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }
  }
}

.settings-popup {
  padding: 24px;
  
  .popup-title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 24px;
  }
  
  :deep(.van-cell-group--inset) {
    margin: 0 0 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
  }
  
  :deep(.van-dropdown-menu__bar) {
    background: transparent;
    box-shadow: none;
    height: 28px;
  }
  
  :deep(.van-dropdown-menu__item) {
    justify-content: flex-end;
  }
  
  .settings-actions {
    margin-top: 24px;
  }
}

@media (max-width: 480px) {
  .me-container {
    padding: 16px;
  }
}
</style>
