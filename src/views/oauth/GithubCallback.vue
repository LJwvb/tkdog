<template>
  <div class="oauth-callback">
    <div class="callback-card">
      <div v-if="loading" class="spinner"></div>
      <div v-if="success" class="success-icon">✓</div>
      <div v-if="error" class="error-icon">✕</div>
      <p class="callback-text">{{ message }}</p>
      <p v-if="success" class="callback-sub">正在跳转...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { githubCallback } from '@/services';
import store from '@/store';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const error = ref(false);
const message = ref('正在处理 GitHub 授权...');

onMounted(async () => {
  try {
    // hash 路由下，query 参数在 route.query 中
    const code = route.query.code as string;
    const state = route.query.state as string;
    console.log('[GithubCallback] 解析到 code:', code, 'state:', state);

    if (!code) {
      console.error('[GithubCallback] 缺少 code 参数');
      throw new Error('授权失败：缺少 code 参数');
    }

    console.log('[GithubCallback] 调用 /api/oauth/github/callback...');
    // 调用后端回调接口
    const res: any = await githubCallback({ code, state });
    console.log('[GithubCallback] 接口返回:', res);

    if (res) {
      console.log(
        '[GithubCallback] 登录成功，res.userId:',
        res?.userId,
        'res.phone:',
        res?.phone,
        'res.username:',
        res?.username,
      );
      // 登录成功，存储用户信息
      store.commit('setUserData', res);
      console.log(
        '[GithubCallback] store.state.userData:',
        store.state.userData,
      );
      success.value = true;
      message.value = 'GitHub 登录成功';
      ElMessage.success('GitHub 登录成功');
      // 延迟跳转首页
      setTimeout(() => {
        router.replace('/');
      }, 800);
    } else {
      throw new Error('登录失败');
    }
  } catch (err: any) {
    error.value = true;
    loading.value = false;
    message.value = err?.message || 'GitHub 登录失败';
    ElMessage.error(err?.message || 'GitHub 登录失败');
    // 延迟跳转回登录页
    setTimeout(() => {
      router.replace('/Login');
    }, 1500);
  }
});
</script>

<style scoped>
.oauth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a1628 0%, #1a2540 50%, #0f1830 100%);
}
.callback-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(140, 200, 255, 0.2);
  border-radius: 16px;
  padding: 48px 64px;
  text-align: center;
  backdrop-filter: blur(10px);
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(140, 200, 255, 0.2);
  border-top-color: #00a6ff;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.success-icon {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-radius: 50%;
  background: rgba(0, 200, 100, 0.2);
  color: #00c864;
  font-size: 28px;
  margin: 0 auto 20px;
}
.error-icon {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-radius: 50%;
  background: rgba(255, 80, 80, 0.2);
  color: #ff5050;
  font-size: 28px;
  margin: 0 auto 20px;
}
.callback-text {
  color: #eaf6ff;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px;
}
.callback-sub {
  color: rgba(180, 210, 240, 0.6);
  font-size: 14px;
  margin: 0;
}
</style>
