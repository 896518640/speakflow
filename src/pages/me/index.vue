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

// 路由与状态
const router = useRouter();
const userStore = useUserStore();
const { isDark, setDarkMode } = useDark();
const { loading: authLoading, loginWithApi: login, logout } = useAuth();

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
  try {
    await login(loginForm.value.email, loginForm.value.password);
    showSuccessToast('登录成功');
    showLoginPopup.value = false;
  } catch (error) {
    showToast('登录失败，请检查账号密码');
  }
};

// 注册处理
const handleRegister = async () => {
  try {
    showToast('注册功能即将上线');
    // 模拟成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    showLoginPopup.value = false;
  } catch (error) {
    showToast('注册失败，请稍后再试');
  }
};

// 退出登录
const handleLogout = () => {
  logout();
  showToast('已退出登录');
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
  try {
    await login('guest@speakflow.app', 'guestpassword');
    showSuccessToast('已以游客身份登录');
    showLoginPopup.value = false;
  } catch (error) {
    showToast('游客登录失败，请稍后再试');
  }
};
</script>

<template>
  <div class="me-page">
    <!-- 顶部背景 -->
    <div class="bg-pattern">
      <div class="bg-gradient"></div>
    </div>
    
    <!-- 用户信息卡片 -->
    <div class="user-profile">
      <div class="profile-header">
        <div class="avatar-wrapper">
          <van-image
            round
            width="88"
            height="88"
            class="avatar"
            :src="userStore.isLoggedIn 
              ? (userStore.profile.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg') 
              : 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
            fit="cover"
          >
            <template #error>
              <div class="avatar-fallback">{{ userStore.isLoggedIn ? userStore.profile.username.charAt(0).toUpperCase() : '游' }}</div>
            </template>
          </van-image>
          
          <div v-if="userStore.isLoggedIn && userStore.profile.isPremium" class="premium-badge">
            <van-icon name="diamond" />
            <span>Pro</span>
          </div>
        </div>
        
        <div class="profile-info">
          <h2 class="profile-name">{{ userStore.isLoggedIn ? userStore.profile.username : '游客' }}</h2>
          <p v-if="userStore.isLoggedIn" class="profile-email">{{ userStore.profile.email }}</p>
          <p v-else class="profile-hint">登录以解锁所有功能</p>
        </div>
      </div>
      
      <div class="profile-actions">
        <template v-if="userStore.isLoggedIn">
          <van-button round type="primary" icon="setting-o" class="action-btn" @click="showSettings = true">设置</van-button>
          <van-button round plain type="danger" icon="cross" class="action-btn" @click="handleLogout">退出</van-button>
        </template>
        <template v-else>
          <van-button round type="primary" icon="friends-o" block @click="showLoginPopup = true">登录 / 注册</van-button>
        </template>
      </div>
    </div>
    
    <!-- 功能卡片 -->
    <div class="feature-cards">
      <!-- 使用统计卡片 -->
      <div class="stat-card">
        <div class="stat-item">
          <div class="stat-value">{{ userStore.translationHistory?.length || 0 }}</div>
          <div class="stat-label">翻译记录</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">收藏数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">使用分钟</div>
        </div>
      </div>
      
      <!-- 快捷功能卡片 -->
      <div class="quick-actions">
        <div class="quick-action-title">快捷操作</div>
        <div class="quick-action-grid">
          <div class="quick-action-item" @click="router.push('/history')">
            <div class="quick-action-icon">
              <van-icon name="clock" />
            </div>
            <div class="quick-action-label">历史记录</div>
          </div>
          <div class="quick-action-item" @click="router.push('/history?tab=1')">
            <div class="quick-action-icon">
              <van-icon name="star" />
            </div>
            <div class="quick-action-label">我的收藏</div>
          </div>
          <div class="quick-action-item" @click="router.push('/help')">
            <div class="quick-action-icon">
              <van-icon name="guide" />
            </div>
            <div class="quick-action-label">使用帮助</div>
          </div>
          <div class="quick-action-item" @click="handleExportData">
            <div class="quick-action-icon">
              <van-icon name="down" />
            </div>
            <div class="quick-action-label">导出数据</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能列表 -->
    <div class="feature-list">
      <van-cell-group inset class="feature-group">
        <van-cell title="高级功能" is-link center>
          <template #icon>
            <div class="cell-icon">
              <van-icon name="fire" />
            </div>
          </template>
          <template #value>
            <div class="cell-badge" v-if="!userStore.isLoggedIn">未解锁</div>
          </template>
        </van-cell>
        <van-cell 
          title="离线语言包" 
          is-link 
          center
          :class="{ 'cell-disabled': !userStore.isLoggedIn }"
          @click="handleOfflinePackages"
        >
          <template #icon>
            <div class="cell-icon">
              <van-icon name="down" />
            </div>
          </template>
        </van-cell>
        <van-cell 
          title="语音定制" 
          is-link 
          center
          :class="{ 'cell-disabled': !userStore.isLoggedIn }"
          @click="handleVoiceCustomization"
        >
          <template #icon>
            <div class="cell-icon">
              <van-icon name="music" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
      
      <van-cell-group inset class="feature-group">
        <van-cell title="应用与支持" is-link center>
          <template #icon>
            <div class="cell-icon">
              <van-icon name="apps" />
            </div>
          </template>
        </van-cell>
        <van-cell title="关于我们" is-link center to="/about">
          <template #icon>
            <div class="cell-icon">
              <van-icon name="info" />
            </div>
          </template>
        </van-cell>
        <van-cell title="分享应用" is-link center @click="handleShareApp">
          <template #icon>
            <div class="cell-icon">
              <van-icon name="share" />
            </div>
          </template>
        </van-cell>
        <van-cell title="检查更新" is-link center @click="checkUpdate">
          <template #icon>
            <div class="cell-icon">
              <van-icon name="upgrade" />
            </div>
          </template>
          <template #value>
            <div class="version-tag">v1.0.0</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    
    <!-- 登录弹窗 -->
    <van-popup 
      v-model:show="showLoginPopup" 
      closeable 
      position="bottom" 
      :style="{ height: '65%' }"
      round
    >
      <div class="auth-popup">
        <h2 class="auth-title">欢迎使用 SpeakFlow</h2>
        
        <van-tabs v-model:active="activeTab" animated swipeable>
          <van-tab title="登录" name="login">
            <van-form @submit="handleLogin" class="auth-form">
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
              
              <div class="auth-links">
                <span class="auth-link">忘记密码?</span>
              </div>
              
              <div class="auth-actions">
                <van-button round block type="primary" native-type="submit" :loading="authLoading" :disabled="authLoading">
                  登录
                </van-button>
                <van-button round block plain @click="handleQuickLogin" :loading="authLoading" :disabled="authLoading">
                  游客体验
                </van-button>
              </div>
            </van-form>
          </van-tab>
          
          <van-tab title="注册" name="register">
            <van-form @submit="handleRegister" class="auth-form">
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
              
              <div class="auth-links">
                <span class="auth-hint">注册即表示同意用户协议与隐私政策</span>
              </div>
              
              <div class="auth-actions">
                <van-button round block type="primary" native-type="submit" :loading="authLoading" :disabled="authLoading">
                  注册
                </van-button>
                <van-button round block plain @click="handleQuickLogin" :loading="authLoading" :disabled="authLoading">
                  游客体验
                </van-button>
              </div>
            </van-form>
          </van-tab>
        </van-tabs>
        
        <div class="social-login">
          <div class="divider">
            <span>社交账号登录</span>
          </div>
          <div class="social-buttons">
            <van-button icon="wechat" round class="social-btn wechat" />
            <van-button icon="apple" round class="social-btn apple" />
            <van-button icon="google" round class="social-btn google" />
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
        <h2 class="settings-title">应用设置</h2>
        
        <van-cell-group inset title="外观设置" class="settings-group">
          <van-cell title="深色模式" center>
            <template #right-icon>
              <van-switch v-model="darkMode" size="24" />
            </template>
          </van-cell>
        </van-cell-group>
        
        <van-cell-group inset title="语言设置" class="settings-group">
          <van-cell title="默认源语言" center>
            <template #right-icon>
              <van-dropdown-menu :overlay="false" active-color="#175199" direction="up">
                <van-dropdown-item v-model="defaultSourceLanguage" :options="languageOptions" />
              </van-dropdown-menu>
            </template>
          </van-cell>
          <van-cell title="默认目标语言" center>
            <template #right-icon>
              <van-dropdown-menu :overlay="false" active-color="#175199" direction="up">
                <van-dropdown-item v-model="defaultTargetLanguage" :options="languageOptions" />
              </van-dropdown-menu>
            </template>
          </van-cell>
        </van-cell-group>
        
        <van-cell-group inset title="翻译设置" class="settings-group">
          <van-cell title="自动翻译" center>
            <template #right-icon>
              <van-switch v-model="autoTranslate" size="24" />
            </template>
          </van-cell>
          <van-cell title="自动朗读翻译" center>
            <template #right-icon>
              <van-switch v-model="autoSpeak" size="24" />
            </template>
          </van-cell>
          <van-cell title="朗读速度" center>
            <template #right-icon>
              <van-stepper v-model="speechRate" :min="0.5" :max="2" :step="0.1" theme="round" />
            </template>
          </van-cell>
        </van-cell-group>
        
        <div class="settings-actions">
          <van-button round block type="primary" @click="saveSettings">
            保存设置
          </van-button>
        </div>
      </div>
    </van-popup>
    
    <!-- 版权信息 -->
    <div class="footer">
      <p>SpeakFlow &copy; {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.me-page {
  min-height: 100vh;
  padding: 0 0 80px;
  position: relative;
  overflow: hidden;
}

// 背景样式
.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 250px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgOTguOTk5TDY0MCAwTDEyODAgOTguOTk5VjE0MEgwVjk4Ljk5OVoiIGZpbGw9IiMxNzUxOTkiLz48cGF0aCBkPSJNMCAxMjAuOTk5TDY0MCAxNS43OTg5TDEyODAgMTIwLjk5OVYxNDBIMFYxMjAuOTk5WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyKSIvPjwvZz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj48c3RvcCBzdG9wLWNvbG9yPSIjNTAyOUI5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMkM3QUU4Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+');
  background-size: cover;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #175199, #50A3F9);
  opacity: 0.9;
}

// 用户资料卡片
.user-profile {
  margin: 20px 16px 0;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .avatar-wrapper {
    position: relative;
    margin-right: 16px;
    flex-shrink: 0;
  }
  
  .avatar {
    border: 3px solid #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .avatar-fallback {
    width: 88px;
    height: 88px;
    background: linear-gradient(135deg, #175199, #50A3F9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 36px;
    font-weight: 600;
  }
  
  .premium-badge {
    position: absolute;
    bottom: 0;
    right: -5px;
    background: linear-gradient(135deg, #FF9500, #FF2D55);
    border-radius: 12px;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(255, 45, 85, 0.3);
    
    .van-icon {
      margin-right: 4px;
      font-size: 14px;
    }
  }
  
  .profile-info {
    flex: 1;
    overflow: hidden;
  }
  
  .profile-name {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 4px;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .profile-email {
    font-size: 14px;
    color: #666;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .profile-hint {
    font-size: 14px;
    color: #888;
    margin: 0;
  }
  
  .profile-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
      flex: 1;
    }
  }
}

// 功能卡片
.feature-cards {
  margin: 20px 16px;
  position: relative;
  z-index: 1;
  
  .stat-card {
    display: flex;
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;
    
    .stat-item {
      flex: 1;
      text-align: center;
      padding: 8px 0;
      
      &:not(:last-child) {
        border-right: 1px solid #eee;
      }
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #175199;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 13px;
      color: #666;
    }
  }
  
  .quick-actions {
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    .quick-action-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    
    .quick-action-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    
    .quick-action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      
      &:active {
        opacity: 0.7;
      }
    }
    
    .quick-action-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      
      .van-icon {
        font-size: 22px;
        color: #175199;
      }
    }
    
    .quick-action-label {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
}

// 功能列表
.feature-list {
  margin: 0 16px;
  position: relative;
  z-index: 1;
  
  .feature-group {
    margin-bottom: 16px;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
  }
  
  :deep(.van-cell) {
    align-items: center;
    padding: 16px;
    
    &::after {
      left: 16px;
      right: 16px;
      border-color: #f5f7fa;
    }
    
    &:last-child::after {
      display: none;
    }
  }
  
  .cell-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    
    .van-icon {
      font-size: 18px;
      color: #175199;
    }
  }
  
  .cell-disabled {
    opacity: 0.6;
  }
  
  .cell-badge {
    font-size: 12px;
    color: #999;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 10px;
  }
  
  .version-tag {
    font-size: 12px;
    color: #999;
  }
}

// 弹窗样式
.auth-popup {
  padding: 24px 16px;
  
  .auth-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #175199, #50A3F9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .auth-form {
    margin-top: 16px;
  }
  
  .auth-links {
    display: flex;
    justify-content: flex-end;
    margin: 16px 0;
    padding: 0 16px;
    
    .auth-link {
      color: #175199;
      font-size: 14px;
    }
    
    .auth-hint {
      color: #999;
      font-size: 13px;
    }
  }
  
  .auth-actions {
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .social-login {
    margin-top: 24px;
    
    .divider {
      display: flex;
      align-items: center;
      color: #999;
      font-size: 14px;
      margin-bottom: 20px;
      
      &::before,
      &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #eee;
      }
      
      span {
        padding: 0 16px;
      }
    }
    
    .social-buttons {
      display: flex;
      justify-content: center;
      gap: 24px;
      
      .social-btn {
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        background: #f5f7fa;
        
        :deep(.van-icon) {
          font-size: 20px;
        }
        
        &.wechat :deep(.van-icon) {
          color: #07C160;
        }
        
        &.apple :deep(.van-icon) {
          color: #000;
        }
        
        &.google :deep(.van-icon) {
          color: #DB4437;
        }
      }
    }
  }
}

.settings-popup {
  padding: 24px 16px;
  
  .settings-title {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #175199, #50A3F9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .settings-group {
    margin-bottom: 16px;
    
    :deep(.van-cell-group__title) {
      padding-left: 16px;
      margin-bottom: 8px;
      font-size: 15px;
      color: #666;
    }
  }
  
  :deep(.van-dropdown-menu__bar) {
    box-shadow: none;
    height: 36px;
  }
  
  .settings-actions {
    margin: 24px 0;
  }
}

.footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #999;
  font-size: 12px;
  z-index: 1;
}

// 深色模式适配
:root[data-theme='dark'] {
  .user-profile {
    background: rgba(30, 30, 32, 0.8);
    
    .profile-name {
      color: #fff;
    }
    
    .profile-email,
    .profile-hint {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .feature-cards {
    .stat-card,
    .quick-actions {
      background: #1e1e20;
    }
    
    .stat-value {
      color: #50A3F9;
    }
    
    .stat-label,
    .quick-action-title {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .quick-action-icon {
      background: #2c2c2e;
      
      .van-icon {
        color: #50A3F9;
      }
    }
    
    .quick-action-label {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .feature-list {
    .feature-group {
      background: #1e1e20;
    }
    
    .cell-icon {
      background: #2c2c2e;
      
      .van-icon {
        color: #50A3F9;
      }
    }
    
    .cell-badge {
      background: #2c2c2e;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .version-tag {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .auth-popup,
  .settings-popup {
    :deep(.van-field__control) {
      color: #fff;
    }
    
    .social-btn {
      background: #2c2c2e !important;
    }
  }
}

// 响应式调整
@media (min-width: 768px) {
  .me-page {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 360px) {
  .quick-action-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 8px !important;
  }
  
  .quick-action-icon {
    width: 36px !important;
    height: 36px !important;
    
    .van-icon {
      font-size: 18px !important;
    }
  }
  
  .quick-action-label {
    font-size: 10px !important;
  }
}
</style>
