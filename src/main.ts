import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 全局注册
const app = createApp(App);
/**全局注册elicon图标 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus); // 引入elementuiPlus
// app.use(store);
app.use(router);
app.mount('#app');
