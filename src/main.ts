import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/index.css';
// Element Plus 暗色主题变量
import 'element-plus/theme-chalk/dark/css-vars.css';

// 主题初始化（localStorage 持久化）
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', theme === 'dark');
// 函数式组件（ElMessage / ElMessageBox / ElNotification）按需加载时需手动引入样式
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/notification/style/css';

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
