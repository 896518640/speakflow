<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabbarItemList = computed(() => {
  const routes = router.getRoutes()
  return routes.filter(route => route.meta.layout?.tabbar?.showTabbar).map(route => ({
    title: route.meta.title,
    icon: route.meta.layout?.tabbar?.icon,
    path: route.path
  }))
})

</script>

<template>
  <van-tabbar
    route
    fixed
    placeholder
    safe-area-inset-bottom
    class="custom-tabbar"
  >
    <van-tabbar-item
      v-for="item in tabbarItemList"
      :key="item.path"
      :icon="item.icon"
      :to="item.path"
      replace
      class="custom-tabbar-item"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="less">
:root:root {
  --van-tabbar-height: 50px;
  --van-tabbar-background-color: transparent !important;
  // --van-tabbar-item-text-color: rgba(0, 0, 0, .1);  // 明亮模式下的颜色
  --van-tabbar-item-active-color: #6366f1;
  --van-tabbar-item-active-background-color: transparent;
}

.van-tabbar {
  background: transparent !important;  // 添加这行
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: none !important;
  box-shadow: none;

  &::after {
    display: none !important;  // 移除底部边框
  }

  .van-tabbar-item {
    background: transparent !important;

    &__icon {
      color: rgba(0, 0, 0, 0.45);  // 明亮模式下的图标颜色
      font-size: 20px;
      margin-bottom: 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &__text {
      color: rgba(0, 0, 0, 0.45);  // 明亮模式下的文字颜色
      font-size: 11px;
      font-weight: 400;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &--active {
      .van-tabbar-item__icon {
        transform: translateY(-1px);
        filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.3));
        color: #6366f1;  // 激活状态的颜色
      }

      .van-tabbar-item__text {
        transform: scale(1.05);
        color: #6366f1;  // 激活状态的颜色
        font-weight: 500;
      }
    }
  }
}

/* 暗色模式适配 */
:root {
  &.dark {
    --van-tabbar-background-color: transparent !important;
    --van-tabbar-item-text-color: rgba(255, 255, 255, 0.45);
    --van-tabbar-item-active-color: #818cf8;
  }
}

.dark {
  .van-tabbar {
    .van-tabbar-item {
      &__icon {
        color: rgba(255, 255, 255, 0.45);
      }

      &__text {
        color: rgba(255, 255, 255, 0.45);
      }

      &--active {
        .van-tabbar-item__icon,
        .van-tabbar-item__text {
          color: #818cf8;
        }
      }
    }
  }
}
</style>
