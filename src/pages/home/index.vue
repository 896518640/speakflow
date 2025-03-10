<script setup lang="ts">
import { demoRoutes, emptyDemoRoutes, systemRoutes, translateRoutes } from "@/router"
import Description from "@@/components/Description.vue"
import Cell from "./components/Cell.vue"
import Title from "./components/Title.vue"
import { useAuth } from '@/common/composables/useAuth';

const { isLoggedIn } = useAuth();
</script>

<template>
  <div un-px-20px un-py-26px un-select-none>
    <Description un-pl-16px />
    <div un-mt-40px>
      <Title text="语音翻译功能" />
      <Cell 
        title="实时语音翻译" 
        path="/translate"
        un-mt-12px 
      />
      <Cell 
        title="语音识别（实时）" 
        path="/rtasr"
        un-mt-12px 
      />
      <Cell 
        title="翻译历史记录" 
        path="/history"
        un-mt-12px 
      />
      <Cell 
        title="使用帮助" 
        path="/help"
        un-mt-12px 
      />
    </div>

    <!-- <div un-my-20px>
      <Title text="更多示例" />
      <Cell
        v-for="route in emptyDemoRoutes"
        :key="route.path"
        :title="route.meta?.title || ''"
        :path="route.path"
        un-mt-12px
      />
    </div> -->
    <!-- <van-divider>🔥 更多优秀示例，期待你的 PR 👏��</van-divider> -->

    <template v-if="!isLoggedIn()">
      <div un-mt-12px un-bg-blue-50 un-p-16px un-rounded-lg un-text-center>
        <p un-text-gray-700 un-mb-10px>登录后即可使用所有功能</p>
        <router-link 
          to="/login" 
          class="login-button"
          un-bg-blue-500 un-text-white un-py-2 un-px-4 un-rounded un-inline-block
        >
          立即登录
        </router-link>
      </div>
    </template>
  </div>
</template>
