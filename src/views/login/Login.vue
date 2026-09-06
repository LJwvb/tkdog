<template>
  <div class="login-wrap">
    <!-- 背景层：Canvas 粒子网络 -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <!-- 背景层：渐变光晕 -->
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>
    <!-- 背景层：网格线 -->
    <div class="grid-lines"></div>

    <div class="login-content">
      <!-- 左侧品牌区 -->
      <div class="brand-panel">
        <div class="brand-logo">
          <img src="@/assets/tkdog.png" alt="" class="logo-img" />
          <span class="logo-ring"></span>
        </div>
        <h1 class="brand-title">题库狗</h1>
        <p class="brand-slogan">面试刷题 · 一站搞定</p>
        <div class="brand-tags">
          <span class="brand-tag">
            <el-icon><MagicStick /></el-icon>AI解题提示
          </span>
          <span class="brand-tag">
            <el-icon><Files /></el-icon>智能组卷
          </span>
          <span class="brand-tag">
            <el-icon><DataAnalysis /></el-icon>AI答题报告
          </span>
          <span class="brand-tag">
            <el-icon><CircleCheck /></el-icon>AI智能判分
          </span>
        </div>
        <div class="brand-stats">
          <div class="stat-item">
            <span class="stat-num" data-count="1000">1000+</span>
            <span class="stat-label">精选题目</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">AI</span>
            <span class="stat-label">智能辅助</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">24h</span>
            <span class="stat-label">随时开练</span>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-card">
        <div class="card-shine"></div>
        <div class="card-header">
          <h2 class="card-title">欢迎回来</h2>
          <p class="card-sub">登录后开启你的刷题之旅</p>
        </div>

        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="phone">
            <div class="input-wrap">
              <el-icon class="input-icon"><Iphone /></el-icon>
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入手机号"
                maxlength="11"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="input-wrap">
              <el-icon class="input-icon"><Lock /></el-icon>
              <el-input
                v-model="ruleForm.password"
                placeholder="请输入密码"
                show-password
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item prop="code">
            <div class="code-row">
              <div class="input-wrap code-input">
                <el-icon class="input-icon"><Key /></el-icon>
                <el-input
                  v-model="ruleForm.code"
                  placeholder="验证码"
                ></el-input>
              </div>
              <div
                class="captcha-img"
                @click="changeLoginCaptcha"
                v-html="loginCaptcha"
              ></div>
            </div>
          </el-form-item>

          <el-form-item prop="checked">
            <div class="agreement-row">
              <el-checkbox v-model="ruleForm.checked" label="0"
                >我已阅读并同意</el-checkbox
              >
              <el-link type="primary" @click="openAgreement('user')"
                >《用户协议》</el-link
              >
              <span class="agreement-sep">和</span>
              <el-link type="primary" @click="openAgreement('privacy')"
                >《隐私政策》</el-link
              >
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="login-btn" @click="toLogin"
              >登 录</el-button
            >
          </el-form-item>

          <el-form-item>
            <el-button class="register-btn" @click="toRegister"
              >注册新账号</el-button
            >
          </el-form-item>

          <el-form-item>
            <div class="oauth-divider">
              <span class="oauth-line"></span>
              <span class="oauth-text">其他登录方式</span>
              <span class="oauth-line"></span>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button class="github-btn" @click="handleGithubLogin">
              <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              GitHub 登录
            </el-button>
          </el-form-item>

          <el-form-item>
            <div class="forgot-row">
              <el-link type="primary" @click="openForgot">忘记密码？</el-link>
            </div>
          </el-form-item>
        </el-form>

        <div class="card-footer">
          <span class="footer-line"></span>
          <span class="footer-text">AI 智能刷题 · 高效备考</span>
          <span class="footer-line"></span>
        </div>
      </div>
    </div>

    <!-- 注册子组件 -->
    <register ref="registerRef"></register>
    <!-- 忘记密码弹窗 -->
    <el-dialog
      v-model="forgotVisible"
      title="重置密码"
      width="420px"
      class="forgot-dialog"
      align-center
    >
      <el-form label-width="80px">
        <el-form-item label="手机号">
          <el-input
            v-model="forgotForm.phone"
            placeholder="请输入注册时的手机号"
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="forgotForm.password"
            type="password"
            show-password
            placeholder="请输入 6-16 位新密码"
          />
        </el-form-item>
        <el-form-item label="验证码">
          <el-row :gutter="8">
            <el-col :span="14">
              <el-input v-model="forgotForm.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="10">
              <!-- eslint-disable vue/no-v-html -->
              <div
                style="cursor: pointer"
                @click="changeForgotCaptcha"
                v-html="forgotCaptcha"
              ></div>
              <!-- eslint-enable vue/no-v-html -->
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="forgotVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForgot">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, unref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { login, getCaptcha, resetPassword, getGithubAuthUrl } from '@/services';
import { ElMessage, type FormInstance } from 'element-plus';
import type { ICaptcha } from '@/types';
import Register from '@/views/login/register.vue';
import {
  Iphone,
  Lock,
  Key,
  MagicStick,
  Files,
  DataAnalysis,
  CircleCheck,
} from '@element-plus/icons-vue';
const store = useStore();

// 表单的ref
const ruleFormRef = ref<FormInstance>();
// 子组件的ref
const registerRef = ref<InstanceType<typeof Register>>();
// 路由对象
const router = useRouter();

const loginCaptcha = ref<string>('');
const forgotCaptcha = ref<string>('');
// 忘记密码
const forgotVisible = ref(false);
const forgotForm = reactive({
  phone: '',
  password: '',
  code: '',
});
const submitForgot = async () => {
  const reg = /^1[3456789][0-9]{9}$/;
  if (!reg.test(forgotForm.phone)) {
    ElMessage.error('手机号不合法');
    return;
  }
  if (forgotForm.password.length < 6 || forgotForm.password.length > 16) {
    ElMessage.error('密码长度需在6-16位之间');
    return;
  }
  if (!forgotForm.code) {
    ElMessage.error('请输入验证码');
    return;
  }
  // 验证码随请求提交，由服务端校验
  await resetPassword({
    phone: forgotForm.phone,
    password: forgotForm.password,
    code: forgotForm.code,
  });
  ElMessage.success('密码重置成功，请重新登录');
  forgotVisible.value = false;
  forgotForm.phone = '';
  forgotForm.password = '';
  forgotForm.code = '';
};

//传验证参
const params: ICaptcha = {
  width: 120,
  height: 36,
};
// 获取验证码（答案由服务端校验，前端只展示图片）
const Captcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
};
Captcha();

const changeLoginCaptcha = async () => {
  const res = await getCaptcha(params);
  loginCaptcha.value = res.data;
};
const changeForgotCaptcha = async () => {
  const res = await getCaptcha(params);
  forgotCaptcha.value = res.data;
};
const openForgot = () => {
  forgotVisible.value = true;
  changeForgotCaptcha();
};
const ruleForm = reactive({
  phone: '', // 手机号
  password: '', // 密码
  code: '', // 验证码
  checked: '', // 是否同意用户协议
});

// 校验规则
const rules = ref({
  phone: [
    {
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void,
      ) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }

        const reg = /^1[3456789][0-9]{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号不合法'));
        }

        callback();
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '密码必须在6-20位之间', trigger: 'blur' },
  ],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
});

// 登录（验证码由服务端校验，前端不再做 md5 对比）
const toLogin = async () => {
  const form = unref(ruleFormRef);

  if (!form) return;
  try {
    if (!ruleForm.checked) {
      ElMessage.error('请勾选用户协议');
      return;
    }
    await form.validate();
    const data = await login(ruleForm);
    // 后端返回完整用户信息（含本人手机号），直接写入登录态
    store.commit('setUserData', data);
    ElMessage.success({
      message: '登录成功~',
      type: 'success',
    });
    localStorage.setItem('uid', ruleForm.phone);
    router.push('/');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    changeLoginCaptcha();
  }
};

// GitHub 第三方登录
const handleGithubLogin = async () => {
  console.log('[GitHub Login] 点击 GitHub 登录按钮');
  try {
    console.log('[GitHub Login] 调用 /api/oauth/github 获取授权 URL...');
    const res: any = await getGithubAuthUrl();
    console.log('[GitHub Login] 接口返回:', res);
    if (res?.authUrl) {
      console.log('[GitHub Login] 跳转到 GitHub 授权页:', res.authUrl);
      window.location.href = res.authUrl;
    } else {
      console.error('[GitHub Login] 接口未返回 authUrl');
      ElMessage.error('GitHub 登录暂不可用');
    }
  } catch (err: any) {
    console.error('[GitHub Login] 获取授权 URL 失败:', err);
    ElMessage.error(err?.message || 'GitHub 登录初始化失败');
  }
};

// 弹出注册子组件
const toRegister = () => {
  if (!registerRef.value) return;
  registerRef.value.dialogVisible = true;
};

// 打开用户协议/隐私政策（优先新窗口；被拦截时当前页跳转兜底）
const openAgreement = (type: 'user' | 'privacy') => {
  const base =
    window.location.origin + window.location.pathname + window.location.search;
  const hash = type === 'privacy' ? '#/privacy' : '#/agreement';
  const win = window.open(base + hash, '_blank');
  if (!win) {
    router.push(hash.replace('#', ''));
  }
};

// ============ Canvas 粒子网络背景 ============
const particleCanvas = ref<HTMLCanvasElement>();
let animId = 0;

const initParticles = () => {
  const canvas = particleCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
  }[] = [];
  const COUNT = 60;
  const LINK_DIST = 130;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const spawn = () => {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    // 连线
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.28;
          ctx.strokeStyle = `rgba(64, 196, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    // 粒子
    for (const p of particles) {
      ctx.fillStyle = 'rgba(140, 220, 255, 0.75)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  };

  resize();
  spawn();
  draw();
  window.addEventListener('resize', resize);
  window.addEventListener('resize', spawn);
};

onMounted(() => {
  initParticles();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
});
</script>

<style scoped>
.login-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
      1200px 800px at 80% -10%,
      rgba(0, 180, 255, 0.14),
      transparent 60%
    ),
    radial-gradient(
      1000px 700px at -10% 110%,
      rgba(0, 120, 255, 0.18),
      transparent 60%
    ),
    linear-gradient(135deg, #050d1a 0%, #0a1a2e 45%, #0c2438 100%);
}

/* ============ 背景层 ============ */
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 1;
  animation: glowFloat 12s ease-in-out infinite alternate;
}
.glow-1 {
  width: 420px;
  height: 420px;
  top: -80px;
  right: 12%;
  background: rgba(0, 150, 255, 0.22);
}
.glow-2 {
  width: 360px;
  height: 360px;
  bottom: -60px;
  left: 6%;
  background: rgba(0, 200, 220, 0.16);
  animation-delay: -4s;
}
.glow-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 42%;
  background: rgba(40, 120, 255, 0.12);
  animation-delay: -8s;
}
@keyframes glowFloat {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(30px, 24px) scale(1.12);
  }
}

.grid-lines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: linear-gradient(
      rgba(90, 180, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(90, 180, 255, 0.05) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(
    ellipse 80% 70% at 50% 50%,
    rgba(0, 0, 0, 0.9),
    transparent 90%
  );
}

/* ============ 内容区 ============ */
.login-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 72px;
  animation: contentIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes contentIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 品牌区 ============ */
.brand-panel {
  color: #eaf6ff;
  max-width: 420px;
}
.brand-logo {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}
.logo-img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  box-shadow: 0 0 28px rgba(0, 170, 255, 0.55);
}
.logo-ring {
  position: absolute;
  inset: -10px;
  border-radius: 20px;
  border: 1px solid rgba(0, 190, 255, 0.35);
  animation: ringPulse 2.6s ease-in-out infinite;
}
@keyframes ringPulse {
  0%,
  100% {
    transform: scale(0.94);
    opacity: 0.35;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.85;
  }
}

.brand-title {
  font-size: 46px;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0 0 10px;
  background: linear-gradient(90deg, #fff 20%, #59d5ff 55%, #2ea8ff 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: titleFlow 6s linear infinite;
}
@keyframes titleFlow {
  to {
    background-position: -200% 0;
  }
}

.brand-slogan {
  font-size: 17px;
  color: rgba(200, 230, 255, 0.75);
  letter-spacing: 3px;
  margin: 0 0 30px;
}

.brand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 38px;
}
.brand-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13px;
  color: rgba(220, 240, 255, 0.92);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(120, 200, 255, 0.22);
  border-radius: 999px;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
}
.brand-tag:hover {
  border-color: rgba(0, 190, 255, 0.6);
  background: rgba(0, 170, 255, 0.12);
  transform: translateY(-2px);
}

.brand-stats {
  display: flex;
  align-items: center;
  gap: 26px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #59d5ff;
  text-shadow: 0 0 18px rgba(0, 170, 255, 0.45);
}
.stat-label {
  font-size: 13px;
  color: rgba(190, 220, 250, 0.65);
}
.stat-divider {
  width: 1px;
  height: 34px;
  background: rgba(140, 200, 255, 0.22);
}

/* ============ 登录卡片 ============ */
.login-card {
  position: relative;
  width: 410px;
  padding: 42px 40px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(140, 200, 255, 0.16);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  box-shadow: 0 24px 60px rgba(0, 8, 20, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
/* 顶部渐变流光 */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 220%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 200, 255, 0.9),
    rgba(80, 160, 255, 0.9),
    transparent
  );
  animation: topLine 4s ease-in-out infinite;
}
@keyframes topLine {
  0%,
  100% {
    left: -60%;
  }
  50% {
    left: 0%;
  }
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(255, 255, 255, 0.08),
    transparent 45%
  );
  animation: shine 9s ease-in-out infinite;
}
@keyframes shine {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(8%, 6%);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 26px;
}
.card-title {
  font-size: 26px;
  font-weight: 700;
  color: #f0f8ff;
  margin: 0 0 6px;
  letter-spacing: 2px;
}
.card-sub {
  font-size: 14px;
  color: rgba(190, 220, 250, 0.6);
  margin: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

/* 忘记密码弹窗：深色主题 */
.forgot-dialog .el-dialog {
  background: linear-gradient(145deg, #1a2540 0%, #0f1830 100%) !important;
  border: 1px solid rgba(140, 200, 255, 0.2) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 150, 255, 0.1) !important;
}
.forgot-dialog .el-dialog__header {
  border-bottom: 1px solid rgba(140, 200, 255, 0.15) !important;
  padding: 20px 24px !important;
  margin-right: 0 !important;
}
.forgot-dialog .el-dialog__title {
  color: #eaf6ff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
}
.forgot-dialog .el-dialog__headerbtn .el-dialog__close {
  color: rgba(180, 210, 240, 0.6) !important;
}
.forgot-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #00a6ff !important;
}
.forgot-dialog .el-dialog__body {
  padding: 24px !important;
  color: #c8dcf0 !important;
}
.forgot-dialog .el-dialog__footer {
  border-top: 1px solid rgba(140, 200, 255, 0.15) !important;
  padding: 16px 24px !important;
}
.forgot-dialog .el-form-item__label {
  color: rgba(200, 225, 250, 0.85) !important;
}
.forgot-dialog .el-button--default {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(140, 200, 255, 0.3) !important;
  color: #c8dcf0 !important;
}
.forgot-dialog .el-button--default:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(0, 190, 255, 0.5) !important;
  color: #eaf6ff !important;
}

/* 输入框：透明玻璃底（强制覆盖 Element Plus 默认白色背景） */
.login-form :deep(.el-input__wrapper),
.login-form .el-input__wrapper,
.forgot-dialog .el-input__wrapper {
  background-color: #162236 !important;
  background: #162236 !important;
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(140, 200, 255, 0.18) inset;
  padding: 2px 12px;
  transition: all 0.3s ease;
}
.login-form :deep(.el-input__wrapper:hover),
.login-form .el-input__wrapper:hover,
.forgot-dialog .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px rgba(0, 190, 255, 0.4) inset;
  background-color: #1a2638 !important;
}
.login-form :deep(.el-input__wrapper.is-focus),
.login-form .el-input__wrapper.is-focus,
.forgot-dialog .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1.5px rgba(0, 190, 255, 0.75) inset,
    0 0 18px rgba(0, 170, 255, 0.18);
  background-color: #1c2a40 !important;
}
/* 错误状态下也保持深色背景 */
.login-form :deep(.el-input__wrapper.is-error),
.login-form .el-input__wrapper.is-error,
.forgot-dialog .el-input__wrapper.is-error {
  background-color: #162236 !important;
  box-shadow: 0 0 0 1px rgba(255, 80, 80, 0.5) inset;
}
.login-form :deep(.el-input__inner),
.login-form .el-input__inner,
.forgot-dialog .el-input__inner {
  color: #eaf6ff !important;
  height: 40px;
  font-size: 14px;
  -webkit-text-fill-color: #eaf6ff !important;
}
.login-form :deep(.el-input__inner::placeholder),
.login-form .el-input__inner::placeholder,
.forgot-dialog .el-input__inner::placeholder {
  color: rgba(180, 210, 240, 0.45) !important;
}
/* 密码显示按钮颜色 */
.login-form :deep(.el-input__password),
.login-form .el-input__password,
.forgot-dialog .el-input__password {
  color: rgba(140, 200, 255, 0.65);
}

/* 浏览器自动填充（autofill）时覆盖默认白色/黄色背景 */
.login-form :deep(input:-webkit-autofill),
.login-form :deep(input:-internal-autofill-selected),
.login-form input:-webkit-autofill,
.login-form input:-internal-autofill-selected,
.forgot-dialog input:-webkit-autofill,
.forgot-dialog input:-internal-autofill-selected {
  /* 用内阴影覆盖背景色（autofill 状态下 background-color 无效） */
  -webkit-box-shadow: 0 0 0 1000px #162236 inset !important;
  box-shadow: 0 0 0 1000px #162236 inset !important;
  /* 文字颜色 */
  -webkit-text-fill-color: #eaf6ff !important;
  caret-color: #eaf6ff !important;
  /* 延迟背景变化，防止闪烁 */
  transition: background-color 5000s ease-in-out 0s !important;
}
/* autofill 时的 hover/focus 状态 */
.login-form :deep(input:-webkit-autofill:hover),
.login-form :deep(input:-webkit-autofill:focus),
.login-form input:-webkit-autofill:hover,
.login-form input:-webkit-autofill:focus,
.forgot-dialog input:-webkit-autofill:hover,
.forgot-dialog input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  -webkit-text-fill-color: #eaf6ff !important;
}

.input-wrap {
  position: relative;
  width: 100%;
}
.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: rgba(140, 200, 255, 0.65);
  font-size: 16px;
  pointer-events: none;
}
.input-wrap :deep(.el-input) {
  width: 100%;
}
.input-wrap :deep(.el-input__wrapper) {
  padding-left: 42px;
}

.code-row {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: stretch;
}
.code-input {
  flex: 1;
}
.code-input :deep(.el-input__wrapper) {
  padding-left: 42px;
}
.captcha-img {
  cursor: pointer;
  flex-shrink: 0;
  width: 118px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(140, 200, 255, 0.18);
  overflow: hidden;
  transition: all 0.25s ease;
}
.captcha-img:hover {
  border-color: rgba(0, 190, 255, 0.5);
}
.captcha-img :deep(img),
.captcha-img :deep(svg) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 协议行 */
.agreement-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  flex-wrap: wrap;
  color: rgba(200, 225, 250, 0.75);
}
.agreement-row :deep(.el-checkbox__label) {
  color: rgba(200, 225, 250, 0.75);
  font-size: 13px;
}
.agreement-row :deep(.el-checkbox__inner) {
  background: transparent;
  border-color: rgba(140, 200, 255, 0.4);
}
.agreement-row :deep(.el-checkbox.is-checked .el-checkbox__inner) {
  background: #00a6ff;
  border-color: #00a6ff;
}
.agreement-row :deep(.el-link) {
  font-size: 13px;
  --el-link-primary-text-color: #4fc3ff;
}
.agreement-sep {
  color: rgba(190, 220, 250, 0.5);
}

/* 登录按钮：渐变流光 */
.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 6px;
  border: none;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(120deg, #00c6ff, #0072ff, #00c6ff);
  background-size: 200% 100%;
  box-shadow: 0 8px 24px rgba(0, 120, 255, 0.35);
  transition: all 0.35s ease;
}
.login-btn:hover {
  background-position: 100% 0;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 140, 255, 0.5);
}
.login-btn:active {
  transform: translateY(0);
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  border-radius: 12px;
  color: rgba(220, 240, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(140, 200, 255, 0.25);
  transition: all 0.3s ease;
}
.register-btn:hover {
  border-color: rgba(0, 190, 255, 0.6);
  background: rgba(0, 170, 255, 0.12);
  color: #fff;
}

/* 第三方登录分割线 */
.oauth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
}
.oauth-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 200, 255, 0.25),
    transparent
  );
}
.oauth-text {
  font-size: 12px;
  color: rgba(180, 210, 240, 0.5);
  white-space: nowrap;
}

/* GitHub 登录按钮 */
.github-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  border-radius: 12px;
  color: #eaf6ff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(140, 200, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}
.github-btn:hover {
  border-color: rgba(0, 190, 255, 0.6);
  background: rgba(0, 170, 255, 0.12);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 150, 255, 0.2);
}
.github-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.forgot-row {
  display: flex;
  justify-content: center;
  width: 100%;
}
.forgot-row :deep(.el-link) {
  color: rgba(160, 215, 255, 0.75);
  font-size: 13px;
}
.forgot-row :deep(.el-link:hover) {
  color: #4fc3ff;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.footer-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(140, 200, 255, 0.25),
    transparent
  );
}
.footer-text {
  font-size: 12px;
  color: rgba(180, 215, 245, 0.5);
  letter-spacing: 1px;
  white-space: nowrap;
}

/* 忘记密码弹窗：玻璃拟态（teleport 到 body，用 :global 生效） */
:global(.forgot-dialog) {
  background: rgba(13, 27, 45, 0.82);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  border: 1px solid rgba(140, 200, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 28px 70px rgba(0, 8, 20, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
:global(.forgot-dialog .el-dialog__header) {
  padding: 24px 24px 8px;
}
:global(.forgot-dialog .el-dialog__title) {
  color: #f0f8ff;
  font-weight: 600;
  letter-spacing: 2px;
}
:global(.forgot-dialog .el-dialog__body) {
  padding: 16px 24px 8px;
}
:global(.forgot-dialog .el-dialog__footer) {
  padding: 8px 24px 24px;
}
:global(.forgot-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: rgba(190, 220, 250, 0.6);
}
:global(.forgot-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #fff;
}
:global(.forgot-dialog .el-form-item__label) {
  color: rgba(200, 225, 250, 0.85);
  font-size: 14px;
}
/* ============ 忘记密码弹窗深色主题（全局，因为 dialog teleport 到 body） ============ */
:global(.forgot-dialog .el-dialog) {
  background: linear-gradient(145deg, #1a2540 0%, #0f1830 100%) !important;
  border: 1px solid rgba(140, 200, 255, 0.2) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 150, 255, 0.1) !important;
}
:global(.forgot-dialog .el-dialog__header) {
  border-bottom: 1px solid rgba(140, 200, 255, 0.15) !important;
  padding: 20px 24px !important;
  margin-right: 0 !important;
}
:global(.forgot-dialog .el-dialog__title) {
  color: #eaf6ff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
}
:global(.forgot-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: rgba(180, 210, 240, 0.6) !important;
}
:global(.forgot-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #00a6ff !important;
}
:global(.forgot-dialog .el-dialog__body) {
  padding: 24px !important;
  color: #c8dcf0 !important;
}
:global(.forgot-dialog .el-dialog__footer) {
  border-top: 1px solid rgba(140, 200, 255, 0.15) !important;
  padding: 16px 24px !important;
}
:global(.forgot-dialog .el-form-item__label) {
  color: rgba(200, 225, 250, 0.85) !important;
}
/* 输入框 */
:global(.forgot-dialog .el-input__wrapper) {
  background-color: #162236 !important;
  background: #162236 !important;
  box-shadow: 0 0 0 1px rgba(140, 200, 255, 0.18) inset !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}
:global(.forgot-dialog .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(0, 190, 255, 0.4) inset !important;
  background-color: #1a2638 !important;
}
:global(.forgot-dialog .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1.5px rgba(0, 190, 255, 0.75) inset,
    0 0 16px rgba(0, 170, 255, 0.15) !important;
  background-color: #1c2a40 !important;
}
:global(.forgot-dialog .el-input__wrapper.is-error) {
  background-color: #162236 !important;
  box-shadow: 0 0 0 1px rgba(255, 80, 80, 0.5) inset !important;
}
:global(.forgot-dialog .el-input__inner) {
  color: #eaf6ff !important;
  -webkit-text-fill-color: #eaf6ff !important;
}
:global(.forgot-dialog .el-input__inner::placeholder) {
  color: rgba(180, 210, 240, 0.45) !important;
}
:global(.forgot-dialog .el-input__password) {
  color: rgba(140, 200, 255, 0.65) !important;
}
/* autofill 覆盖 */
:global(.forgot-dialog input:-webkit-autofill),
:global(.forgot-dialog input:-internal-autofill-selected) {
  -webkit-box-shadow: 0 0 0 1000px #162236 inset !important;
  box-shadow: 0 0 0 1000px #162236 inset !important;
  -webkit-text-fill-color: #eaf6ff !important;
  caret-color: #eaf6ff !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
:global(.forgot-dialog input:-webkit-autofill:hover),
:global(.forgot-dialog input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  box-shadow: 0 0 0 1000px #1c2a40 inset !important;
  -webkit-text-fill-color: #eaf6ff !important;
}
/* 按钮 */
:global(.forgot-dialog .el-button--primary) {
  border: none !important;
  border-radius: 10px !important;
  color: #fff !important;
  font-weight: 500 !important;
  background: linear-gradient(120deg, #00c6ff, #0072ff, #00c6ff) !important;
  background-size: 200% 100% !important;
  box-shadow: 0 8px 22px rgba(0, 120, 255, 0.35) !important;
  transition: all 0.35s ease !important;
}
:global(.forgot-dialog .el-button--primary:hover) {
  background-position: 100% 0 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 28px rgba(0, 140, 255, 0.5) !important;
}
:global(.forgot-dialog .el-button:not(.el-button--primary)) {
  border-radius: 10px !important;
  color: rgba(220, 240, 255, 0.9) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(140, 200, 255, 0.25) !important;
  transition: all 0.3s ease !important;
}
:global(.forgot-dialog .el-button:not(.el-button--primary):hover) {
  border-color: rgba(0, 190, 255, 0.6) !important;
  background: rgba(0, 170, 255, 0.12) !important;
  color: #fff !important;
}

/* ============ 响应式 ============ */
@media (max-width: 1000px) {
  .brand-panel {
    display: none;
  }
  .login-content {
    gap: 0;
  }
}
@media (max-width: 520px) {
  .login-card {
    width: 92%;
    padding: 32px 22px 24px;
  }
  .brand-title {
    font-size: 34px;
  }
}
</style>
