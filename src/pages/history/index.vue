<template>
  <div class="history-container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="back-button" @click="router.back()">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">翻译历史</div>
      <div class="tools">
        <div class="tool-icon" @click="generateMockData">
          <van-icon name="replay" />
        </div>
        <div class="tool-icon" @click="showSearch = true">
          <van-icon name="search" />
        </div>
        <div class="tool-icon" @click="exportHistory">
          <van-icon name="down" />
        </div>
        <div class="tool-icon" @click="confirmClear">
          <van-icon name="delete" />
        </div>
      </div>
    </div>

    <!-- 波浪背景装饰 -->
    <div class="wave-decoration">
      <div class="blob-animation"></div>
    </div>

    <!-- 简化的分类标签 -->
    <div class="simple-tabs">
      <div class="tab-item" :class="{ active: activeCategory === 'all' && !showFavorites }" @click="switchCategory('all')">
        <i class="tab-icon">
          <van-icon name="notes-o" />
        </i>
        <span>全部</span>
      </div>
      <div class="tab-item" :class="{ active: activeCategory === 'text' && !showFavorites }" @click="switchCategory('text')">
        <i class="tab-icon">
          <van-icon name="chat-o" />
        </i>
        <span>文本</span>
      </div>
      <div class="tab-item" :class="{ active: activeCategory === 'voice' && !showFavorites }" @click="switchCategory('voice')">
        <i class="tab-icon">
          <van-icon name="volume-o" />
        </i>
        <span>语音</span>
      </div>
      <div class="tab-item" :class="{ active: showFavorites }" @click="switchToFavorites()">
        <i class="tab-icon">
          <van-icon name="star-o" />
        </i>
        <span>收藏</span>
      </div>
    </div>

    <div class="content-container">
      <!-- 历史记录内容 -->
      <template v-if="userStore.translationHistory && userStore.translationHistory.length > 0">
        <!-- 没有过滤结果时显示相应的空状态 -->
        <div v-if="!hasFilteredItems" class="empty-container">
          <!-- 收藏为空 -->
          <div v-if="showFavorites" class="empty-state">
            <van-icon name="star-o" size="48" class="empty-icon" />
            <p class="empty-text">暂无收藏记录</p>
            <p class="empty-subtext">您收藏的翻译将显示在这里</p>
          </div>
          
          <!-- 语音类型为空 -->
          <div v-else-if="activeCategory === 'voice'" class="empty-state">
            <van-icon name="volume-o" size="48" class="empty-icon" />
            <p class="empty-text">暂无语音翻译记录</p>
            <p class="empty-subtext">语音翻译的历史记录将显示在这里</p>
          </div>
          
          <!-- 文本类型为空 -->
          <div v-else-if="activeCategory === 'text'" class="empty-state">
            <van-icon name="chat-o" size="48" class="empty-icon" />
            <p class="empty-text">暂无文本翻译记录</p>
            <p class="empty-subtext">文本翻译的历史记录将显示在这里</p>
          </div>
          
          <!-- 搜索结果为空 -->
          <div v-else-if="isFiltering" class="empty-state">
            <van-icon name="search" size="48" class="empty-icon" />
            <p class="empty-text">没有找到匹配的记录</p>
          </div>
        </div>
        
        <!-- 有过滤结果时显示分组内容 -->
        <div v-else class="history-content">
          <!-- 今天的记录 -->
          <template v-if="groupedItems.today.length > 0">
            <div class="time-divider">今天</div>
            <div class="history-items">
              <translation-item-card v-for="item in groupedItems.today" :key="item.id" :item="item"
                @toggle-favorite="userStore.toggleFavorite(item.id)" @delete="userStore.deleteHistoryItem(item.id)"
                @copy="copyText(item.translatedText)" @speak="speakText(item.translatedText, item.targetLanguage)"
                @share="shareTranslation(item)" />
            </div>
          </template>

          <!-- 昨天的记录 -->
          <template v-if="groupedItems.yesterday.length > 0">
            <div class="time-divider">昨天</div>
            <div class="history-items">
              <translation-item-card v-for="item in groupedItems.yesterday" :key="item.id" :item="item"
                @toggle-favorite="userStore.toggleFavorite(item.id)" @delete="userStore.deleteHistoryItem(item.id)"
                @copy="copyText(item.translatedText)" @speak="speakText(item.translatedText, item.targetLanguage)"
                @share="shareTranslation(item)" />
            </div>
          </template>

          <!-- 更早的记录 -->
          <template v-if="groupedItems.earlier.length > 0">
            <div class="time-divider">更早</div>
            <div class="history-items">
              <translation-item-card v-for="item in groupedItems.earlier" :key="item.id" :item="item"
                @toggle-favorite="userStore.toggleFavorite(item.id)" @delete="userStore.deleteHistoryItem(item.id)"
                @copy="copyText(item.translatedText)" @speak="speakText(item.translatedText, item.targetLanguage)"
                @share="shareTranslation(item)" />
            </div>
          </template>
        </div>
      </template>
      
      <!-- 全局空状态（历史记录完全为空） -->
      <div v-else class="empty-container">
        <!-- 显示调试信息 -->
        <div class="debug-info" v-if="isDev">
          <p>历史记录状态: {{ userStore.translationHistory ? "已初始化" : "未初始化" }}</p>
          <p>历史记录数量: {{ userStore.translationHistory ? userStore.translationHistory.length : 0 }}</p>
          <button @click="generateMockData">强制生成测试数据</button>
        </div>
        
        <div class="empty-state">
          <div class="empty-illustration">
            <div class="illustration-bg"></div>
            <div class="illustration-circles">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
              <div class="circle circle-3"></div>
            </div>
            <van-icon name="chat-o" class="main-icon" />
            <div class="floating-elements">
              <div class="floating-element e1">A</div>
              <div class="floating-element e2">文</div>
              <div class="floating-element e3">B</div>
              <div class="floating-element e4">字</div>
            </div>
          </div>
          <h2 class="empty-title">暂无历史记录</h2>
          <p class="empty-description">用SpeakFlow翻译一些内容，<br>它们会出现在这里以便随时查阅</p>
          <div class="empty-actions">
            <button class="primary-action" @click="generateMockData">
              <van-icon name="add-o" class="action-icon" />
              <span>生成测试数据</span>
            </button>
            <button class="secondary-action" @click="router.push('/translate')">
              <van-icon name="exchange" class="action-icon" />
              <span>前往翻译</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 搜索抽屉 -->
    <van-popup v-model:show="showSearch" position="top" :style="{ height: '80px' }">
      <div class="search-container">
        <div class="search-input-wrapper">
          <van-search v-model="searchText" placeholder="搜索翻译历史" shape="round" background="transparent" show-action
            @search="onSearch" @cancel="showSearch = false" @clear="clearSearch" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showDialog, showToast } from 'vant';
import { useUserStore } from '@/pinia/stores/user';
import TranslationItemCard from '@/common/components/history/TranslationItemCard.vue';
import type { TranslationHistoryItem } from '@/pinia/stores/user';

// 基础设置
const router = useRouter();
const userStore = useUserStore();
const showSearch = ref(false);
const searchText = ref('');
const activeCategory = ref('all'); // 'all', 'text', 'voice'
const showFavorites = ref(false);
const isFiltering = ref(false);
const isDev = ref(import.meta.env.DEV);

// 生成测试数据
function generateMockData() {
  // 确保初始化
  if (!userStore.translationHistory) {
    userStore.translationHistory = [];
  }
  
  // 生成测试数据
  const mockItems = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - i * 2);
    
    // 分配到不同天数，所以有今天、昨天和更早的数据
    if (i > 5) {
      date.setDate(date.getDate() - 2);
    } else if (i > 2) {
      date.setDate(date.getDate() - 1);
    }
    
    return {
      id: `mock-${i}-${Date.now()}`,
      sourceText: `这是第 ${i + 1} 条测试文本，用于演示历史记录界面。`,
      translatedText: `This is test message #${i + 1} for demonstrating the history interface.`,
      sourceLanguage: 'zh-CN',
      targetLanguage: 'en-US',
      timestamp: date.getTime(),
      isFavorite: i % 3 === 0, // 每三个项目收藏一个
      isVoice: i % 4 === 0 // 每四个项目是语音翻译
    };
  });
  
  // 直接更新 store 中的数据
  userStore.updateTranslationHistory(mockItems);
  showToast('已生成测试数据');
  console.log('生成测试数据', mockItems.length);
}

// 初始化
onMounted(() => {
  // 加载历史记录
  if (!userStore.translationHistory || userStore.translationHistory.length === 0) {
    // 显示提示或引导用户进行翻译
    showToast('暂无历史记录');
    console.log('空记录状态', userStore.translationHistory);
  } else {
    console.log('有记录状态', userStore.translationHistory.length);
  }

  // 确保数据已经初始化
  if (!userStore.translationHistory) {
    userStore.translationHistory = [];
  }
});

// 根据标签过滤历史记录
const filteredHistory = computed(() => {
  const history = userStore.translationHistory || [];
  
  // 1. 先按照收藏状态过滤
  let filtered = showFavorites.value
    ? history.filter(item => item.isFavorite)
    : history;
  
  // 2. 再按照类别过滤
  if (activeCategory.value !== 'all' && !showFavorites.value) {
    filtered = filtered.filter(item => {
      if (activeCategory.value === 'voice') return item.isVoice;
      if (activeCategory.value === 'text') return !item.isVoice;
      return true;
    });
  }
  
  // 3. 最后按照搜索文本过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.sourceText.toLowerCase().includes(keyword) || 
      item.translatedText.toLowerCase().includes(keyword)
    );
    isFiltering.value = true;
  } else {
    isFiltering.value = false;
  }
  
  return filtered;
});

// 是否有过滤后的项目
const hasFilteredItems = computed(() => filteredHistory.value.length > 0);

// 按时间分组：今天、昨天、更早
const groupedItems = computed(() => {
  const today: TranslationHistoryItem[] = [];
  const yesterday: TranslationHistoryItem[] = [];
  const earlier: TranslationHistoryItem[] = [];
  
  const now = new Date();
  
  // 先对过滤后的记录按时间戳排序（从新到旧）
  const sortedItems = [...filteredHistory.value].sort((a, b) => b.timestamp - a.timestamp);
  
  sortedItems.forEach(item => {
    const date = new Date(item.timestamp);
    
    // 简单判断今天、昨天和更早
    const isToday = date.getDate() === now.getDate() &&
                   date.getMonth() === now.getMonth() &&
                   date.getFullYear() === now.getFullYear();
                   
    const isYesterday = date.getDate() === now.getDate() - 1 &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      today.push(item);
    } else if (isYesterday) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  });
  
  return { today, yesterday, earlier };
});

// 切换到所有记录视图
function switchToAll() {
  showFavorites.value = false;
}

// 切换到收藏视图
function switchToFavorites() {
  showFavorites.value = true;
}

// 搜索
function onSearch() {
  // 搜索逻辑已在计算属性中实现
  showSearch.value = false;
}

// 清除搜索
function clearSearch() {
  searchText.value = '';
  showSearch.value = false;
}

// 复制文本
function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板');
  }).catch(err => {
    console.error('复制失败:', err);
    showToast('复制失败');
  });
}

// 朗读文本
function speakText(text: string, language: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语言代码
    utterance.lang = language;
    
    // 设置语速，添加默认值
    utterance.rate = 1; // 默认语速

    // 开始朗读
    window.speechSynthesis.speak(utterance);

    showToast('正在朗读');
  } else {
    showToast('您的浏览器不支持语音合成');
  }
}

// 分享翻译
function shareTranslation(item: TranslationHistoryItem) {
  // 如果支持原生分享API
  if (navigator.share) {
    navigator.share({
      title: '翻译结果分享',
      text: `${item.sourceText}\n${item.translatedText}`,
    }).catch(() => {
      // 如果分享失败，回退到复制
      const shareText = `${item.sourceText}\n${item.translatedText}`;
      copyText(shareText);
    });
  } else {
    // 复制到剪贴板
    const shareText = `${item.sourceText}\n${item.translatedText}`;
    copyText(shareText);
  }
}

// 确认清空历史
function confirmClear() {
  const action = showFavorites.value ? '清空所有收藏' : '清空所有历史记录';

  showDialog({
    title: '确认操作',
    message: `确定要${action}吗？此操作不可撤销。`,
    showCancelButton: true,
  }).then(() => {
    if (showFavorites.value) {
      // 清空所有收藏（保留记录但取消收藏标记）
      const clearedItems = userStore.translationHistory?.map(item => {
        if (item.isFavorite) {
          return { ...item, isFavorite: false };
        }
        return item;
      }) || [];

      // 更新存储
      userStore.updateTranslationHistory(clearedItems);
      showToast('所有收藏已清空');
    } else {
      // 清空所有历史记录
      userStore.updateTranslationHistory([]);
      showToast('历史记录已清空');
    }
  });
}

// 导出历史记录
function exportHistory() {
  if (!userStore.translationHistory || userStore.translationHistory.length === 0) {
    showToast('暂无记录可导出');
    return;
  }

  const historyData = showFavorites.value ?
    userStore.translationHistory.filter(item => item.isFavorite) :
    userStore.translationHistory;

  // 创建导出数据
  const exportData = {
    history: historyData,
    exportTime: new Date().toISOString(),
    type: showFavorites.value ? 'favorites' : 'history'
  };

  // 转换为JSON
  const dataStr = JSON.stringify(exportData, null, 2);

  // 创建下载链接
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  const exportFileName = `speakflow_${showFavorites.value ? 'favorites' : 'history'}_${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();

  showToast('导出成功');
}

// 切换类别
function switchCategory(category: string) {
  activeCategory.value = category;
  showFavorites.value = false;
}
</script>

<style lang="less" scoped>
.history-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fc;
  position: relative;
  overflow: hidden;
}

/* 顶部标题栏 */
.header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: linear-gradient(135deg, #4a84ef, #5e6bf7);
  color: white;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  font-size: 22px;
  padding: 8px;
  margin-right: 8px;
  margin-left: -8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
  }
}

.title {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tools {
  display: flex;
  gap: 20px;
}

.tool-icon {
  font-size: 20px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
  }
}

/* 波浪背景装饰 */
.wave-decoration {
  position: relative;
  height: 40px;
  background: linear-gradient(135deg, #4a84ef, #5e6bf7);
  overflow: hidden;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  z-index: 2;
  margin-bottom: 20px;
}

.blob-animation {
  position: absolute;
  bottom: -150px;
  right: -15%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  filter: blur(20px);
  opacity: 0.5;
  z-index: 1;
  animation: blob-float 15s ease-in-out infinite alternate;
}

@keyframes blob-float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-10%, 5%) scale(1.1);
  }
  66% {
    transform: translate(5%, -5%) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

/* 分类标签 */
.simple-tabs {
  display: flex;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 32px;
  margin: -24px 16px 0;
  position: relative;
  z-index: 6;
  padding: 4px;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  text-align: center;
  position: relative;
  transition: all 0.3s;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  user-select: none;

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.tab-icon {
  font-size: 20px;
  color: #777;
  margin-bottom: 2px;
  transition: transform 0.3s, color 0.3s;
}

.tab-item.active {
  color: #4a84ef;
  font-weight: 500;
  background-color: #eef4ff;
  box-shadow: 0 2px 8px rgba(74, 132, 239, 0.15);
  
  .tab-icon {
    transform: scale(1.15);
    color: #4a84ef;
    animation: icon-bounce 0.5s ease;
  }
}

@keyframes icon-bounce {
  0%, 100% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(1.3);
  }
}

/* 内容容器 */
.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  z-index: 1;
}

/* 空状态容器 */
.empty-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 历史记录内容 */
.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 24px;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  width: 100%;
}

.time-divider {
  font-size: 14px;
  color: #555;
  padding: 14px 10px 8px;
  font-weight: 500;
  position: sticky;
  top: 0;
  background-color: rgba(248, 249, 252, 0.95);
  z-index: 4;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 8px;
  margin-bottom: 10px;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  animation: slideUp 0.4s ease-out;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 5%;
  animation: fadeScale 0.6s ease-out;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.empty-illustration {
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #f0f4ff, #e8f0ff);
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(74, 132, 239, 0.15), 
              inset 0 -4px 8px rgba(255, 255, 255, 0.8),
              inset 0 4px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.illustration-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg) translateX(-200px);
  animation: glow-sweep 5s ease-in-out infinite alternate;
}

@keyframes glow-sweep {
  0% {
    transform: rotate(30deg) translateX(-200px);
  }
  100% {
    transform: rotate(30deg) translateX(200px);
  }
}

.illustration-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(74, 132, 239, 0.3);
}

.circle-1 {
  width: 70%;
  height: 70%;
  animation: pulse 4s ease-in-out infinite;
}

.circle-2 {
  width: 55%;
  height: 55%;
  animation: pulse 6s ease-in-out infinite reverse;
}

.circle-3 {
  width: 40%;
  height: 40%;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.main-icon {
  font-size: 56px;
  color: #4a84ef;
  opacity: 0.9;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.floating-elements {
  position: absolute;
  width: 140%;
  height: 140%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  font-size: 15px;
  font-weight: 500;
  color: #4a84ef;
  opacity: 0.6;
  filter: blur(0.2px);
}

.e1 {
  top: 25%;
  left: 15%;
  animation: float-element 5s ease-in-out infinite;
}

.e2 {
  top: 20%;
  right: 15%;
  animation: float-element 7s ease-in-out 1s infinite;
}

.e3 {
  bottom: 25%;
  left: 20%;
  animation: float-element 6s ease-in-out 0.5s infinite;
}

.e4 {
  bottom: 20%;
  right: 20%;
  animation: float-element 8s ease-in-out 1.5s infinite;
}

@keyframes float-element {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5px, -5px);
  }
  50% {
    transform: translate(0, -10px);
  }
  75% {
    transform: translate(-5px, -5px);
  }
}

.empty-title {
  font-size: 20px;
  color: #555;
  margin: 16px 0 8px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
}

.empty-description {
  font-size: 15px;
  color: #888;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
  margin-bottom: 28px;
}

.empty-actions {
  display: flex;
  gap: 16px;
}

.primary-action, .secondary-action {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: none;
  outline: none;
}

.primary-action {
  background: linear-gradient(135deg, #4a84ef, #5e6bf7);
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(74, 132, 239, 0.25);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 132, 239, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(74, 132, 239, 0.2);
  }
}

.secondary-action {
  background: rgba(74, 132, 239, 0.1);
  color: #4a84ef;
  font-size: 14px;
  
  &:hover {
    background: rgba(74, 132, 239, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: scale(0.95);
    background: rgba(74, 132, 239, 0.2);
  }
}

.action-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 搜索容器 */
.search-container {
  padding: 12px 16px;
  background: linear-gradient(135deg, #4a84ef, #5e6bf7);
}

.search-input-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

  :deep(.van-search__content) {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 0 6px;
  }

  :deep(.van-field__control) {
    color: #333;
  }

  :deep(.van-cell) {
    padding: 10px 12px;
  }

  :deep(.van-search__action) {
    color: white;
    padding-left: 12px;
    font-size: 14px;
    font-weight: 500;
  }
}

/* 调试信息样式 */
.debug-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 100;
}

.debug-info p {
  margin: 5px 0;
}

// 媒体查询，根据不同屏幕尺寸调整样式
@media (max-width: 360px) {
  .tools {
    gap: 15px;
  }
  
  .tool-icon {
    font-size: 18px;
  }
  
  .main-title {
    font-size: 24px;
    padding-bottom: 8px;
  }
}

@media (min-width: 768px) {
  .history-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  }
  
  .history-content {
    padding: 20px 16px 30px;
  }
  
  .empty-illustration {
    width: 140px;
    height: 140px;
  }
}

// 添加漂亮的动画效果
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>