import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 全局注册
const app = createApp(App);
/**全局注册elicon图标 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
router.beforeEach(function (to, from, next) {
  if (to.meta.needLogin) {
    //页面是否登录
    if (localStorage.getItem('uid')) {
      //本地存储中是否有token(uid)数据
      next(); //表示已经登录
    } else {
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      next({
        path: '/Login',
      });
    }
  } else {
    //表示不需要登录
    next(); //继续往后走
  }
});

app.use(ElementPlus); // 引入elementuiPlus
app.use(store);
app.use(router);
app.mount('#app');
