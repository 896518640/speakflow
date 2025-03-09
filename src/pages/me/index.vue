<script setup lang="ts">
import { useUserStore } from "@/pinia/stores/user"
import { useDark } from "@@/composables/useDark"
import faviconUrl from "/favicon.png?url"
import CustomCell from "@/common/components/CustomCell.vue"

const router = useRouter()

const userStore = useUserStore()

const { isDark, changeDark } = useDark()

function onClick() {
  showToast("更多功能，敬请期待 ~")
}

function onLogout() {
  userStore.resetToken()
  router.push("/login")
}
</script>

<template>
  <div class="me-container">
    <van-cell-group un-mb-8px class="user-profile-group">
      <custom-cell size="large" is-link center @click="onClick" class="user-profile-cell" :border="false">
        <template #title>
          <div un-flex-y-center un-gap-16px>
            <van-image :src="faviconUrl" un-w-44px un-h-44px class="user-avatar" />
            <div un-flex un-flex-col>
              <span class="username">{{ userStore.username }}</span>
              <span class="user-info">个人资料</span>
            </div>
          </div>
        </template>
      </custom-cell>
    </van-cell-group>
    
    <van-cell-group un-mb-8px class="feature-group">
      <custom-cell title="🌗 Dark Mode 黑暗模式" center theme="primary">
        <template #right-icon>
          <van-switch :model-value="isDark" size="min(5.333vw, 40px)" @click="changeDark" class="dark-mode-switch" />
        </template>
      </custom-cell>
      
      <custom-cell title="📚 Documentation 文档教程" is-link url="https://juejin.cn/column/7472609448201666599" theme="success" />
      
      <custom-cell title="📦️ GitHub 代码仓库" is-link url="https://github.com/un-pany/mobvue" />
      
      <custom-cell title="☕ Donate 捐赠" is-link url="https://github.com/un-pany/mobvue/issues/1" />
      
      <custom-cell title="💰 Pay 付费服务" is-link url="https://github.com/un-pany/mobvue/issues/2" theme="primary" />
      
      <custom-cell title="💬 Group 交流群" is-link url="https://github.com/un-pany/mobvue/issues/3" />
    </van-cell-group>
    
    <van-button 
      block 
      class="logout-button" 
      @click="onLogout"
    >
      退出登录
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.me-container {
  padding: 16px;
  min-height: 100vh;
  background-color: var(--van-background-2);
}

.user-profile-group {
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(100, 100, 100, 0.08);
}

.user-profile-cell {
  padding: 16px !important;
}

.user-avatar {
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.username {
  font-weight: 600;
  font-size: 18px;
  color: var(--van-text-color);
}

.user-info {
  font-size: 14px;
  color: var(--van-gray-6);
  margin-top: 4px;
}

.feature-group {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 100, 100, 0.08);
}

.dark-mode-switch {
  :deep(.van-switch__node) {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  &:deep(.van-switch--checked .van-switch__node) {
    transform: translateX(calc(var(--van-switch-size) - var(--van-switch-node-size)));
  }
}

.logout-button {
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(to right, #ff6b6b, #ff8e8e);
  font-weight: 500;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  margin-top: 24px;
  
  &:active {
    opacity: 0.9;
  }
}
</style>
