<template>
  <el-menu @select="handleSelect" default-active="1">
    <el-menu-item index="1">
      <el-icon>
        <User />
      </el-icon>
      个人资料
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon>
        <Star />
      </el-icon>
      我的点赞
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon>
        <Document />
      </el-icon>
      我的题目
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <Clock />
      </el-icon>
      浏览记录
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon>
        <Menu />
      </el-icon>
      我的试卷
    </el-menu-item>
    <el-menu-item index="6">
      <el-icon>
        <ChatLineSquare />
      </el-icon>
      消息通知
    </el-menu-item>
  </el-menu>

  <!-- </div> -->

  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// import router from '../../router'
import { useRouter } from 'vue-router';

const name = ref('me_compon');
const activeIndex2 = ref('1');
const isCollapse = ref(false);
const paths = ref([
  '/user/me_info',
  '/user/me_collection',
  '/user/subject_me',
  '/user/me_history',
  '/user/me_answer',
  '/user/me_test_paper',
  '/user/me_news',
]);
const router = useRouter();
// router.push({
//   path: paths.value[0],
// });

const handleSelect = (index: number) => {
  router.push({
    path: paths.value[index],
  });
};
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style scoped>
.el-main {
  padding: 0px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

.logo1 {
  width: 60px;
  height: 60px;
}

/* 上传头像开始 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 上传头像结束 */

/* 动态添加标签 */
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.colonn {
  margin-left: 20px;
}
</style>
