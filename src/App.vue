<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { ref, reactive, computed, watch, toRefs, onMounted } from 'vue';
import { useQrCodeLogin } from '@dmhsq_app/vue';

const qrLogin = useQrCodeLogin({
  appId: '55fe529b-5ccd-489a-9a50-fe06090f92de',
  token: 'eea84fc9-bb48-48c4-9457-7f56722c2445',
  baseUrl: 'http://localhost:3101',
});

// 在组件挂载时获取二维码
onMounted(() => {
  qrLogin.getQrCode();
});

// 监听登录状态
watch(
  () => qrLogin.loginSuccess.value,
  (newVal) => {
    if (newVal) {
      console.log('登录成功', qrLogin.userInfo.value);
    }
  }
);

// 监听二维码状态
watch(
  () => qrLogin.status.value,
  (newVal) => {
    console.log('二维码状态变化:', newVal);
  }
);

// 监听加载状态
watch(
  () => qrLogin.loading.value,
  (newVal) => {
    console.log('加载状态变化:', newVal);
  }
);

const test = () => {
  console.log('当前状态:', {
    loading: qrLogin.loading.value,
    url: qrLogin.url.value,
    status: qrLogin.status.value,
    loginSuccess: qrLogin.loginSuccess.value
  });
};
</script>

<template>
  <div>
    <button @click="test">测试</button>
    <div v-if="qrLogin.loading.value">Loading...</div>
    <div v-else-if="qrLogin.url.value">
      <a href="https://vite.dev" target="_blank">
        <img :src="qrLogin.url.value" class="logo" alt="QR Code" />
      </a>
    </div>
    <div v-else-if="!qrLogin.success.value">获取二维码失败</div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> 