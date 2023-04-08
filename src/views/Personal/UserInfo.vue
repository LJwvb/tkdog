<template>
  <div class="user-info-container">
    <el-card style="position: relative">
      <div class="main-info">
        <img :src="userInfo?.avatar" class="avatar" />
        <div class="name-box">
          <div class="name">
            <h3>
              {{ userInfo?.username }}
            </h3>
            <div style="margin: 6px 0 0 5px">
              <el-icon v-if="userInfo?.sex === '0'" color="#fab6b6" :size="22"
                ><Female
              /></el-icon>
              <el-icon
                v-else-if="userInfo?.sex === '1'"
                color="#a0cfff"
                :size="22"
                ><Male
              /></el-icon>
              <span v-else>未知</span>
            </div>
          </div>

          <span class="intro">{{
            userInfo?.personalIntroduction
              ? userInfo?.personalIntroduction
              : '暂无个人简介'
          }}</span>
        </div>
      </div>
      <el-button
        type="primary"
        style="margin-top: 20px"
        class="edit-btn"
        @click="editUserInfo"
        >编辑个人信息</el-button
      >
    </el-card>
    <el-card style="margin-top: 20px">
      <div class="question-info">
        <h4>信息</h4>
        <div class="integral">
          积分<el-tooltip
            class="box-item"
            effect="light"
            content="积分=题目获赞数*5+题目上传数*1+题目被审核通过数*2"
            placement="left"
          >
            <el-icon><Warning /></el-icon> </el-tooltip
          >:{{ integral }}
        </div>
        <div>题目获赞数：{{ userInfo?.like_ques_num }}</div>
        <div>题目上传数：{{ userInfo?.upload_ques_num }}</div>
        <div>题目被审核通过数：{{ userInfo?.approvedNums ?? 0 }}</div>
        <div v-if="userInfo?.email">邮箱：{{ userInfo?.email }}</div>
        <div>注册时间：{{ transitionTime(userInfo?.ctime) }}</div>
        <div>最后登录时间：{{ transitionTime(userInfo?.last_login_time) }}</div>
      </div>
    </el-card>
  </div>
  <EditUserInfo v-model:dialogVisible="dialogVisible" :userInfo="userInfo" />
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { transitionTime, transitionSex } from '@/utils/index';
import { getUserInfo } from '@/services';
import EditUserInfo from '@/components/EditUserInfo/index.vue';
const store = useStore();
const dialogVisible = ref(false);
const userInfo = ref<any>({});
const integral = computed(() => {
  const { like_ques_num, upload_ques_num, approvedNums } = userInfo.value;
  return like_ques_num * 5 + upload_ques_num * 1 + approvedNums * 2;
});
const editUserInfo = () => {
  dialogVisible.value = true;
};

const phone = store.state.userData.phone;
onMounted(() => {
  getUserInfo({ phone: phone }).then((res) => {
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  });
});
// 如果用户信息发生变化，重新获取用户信息
watch(
  () => store.state.userData,
  (newVal, oldVal) => {
    getUserInfo({ phone: phone }).then((res) => {
      if (res.code === 200) {
        userInfo.value = res.data;
      }
    });
  },
);
</script>
<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.main-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.intro {
  margin-top: 30px;
}
.name-box {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.name {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.edit-btn {
  position: absolute;
  top: 0px;
  right: 20px;
}
.question-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.question-info > div {
  margin-top: 20px;
  font-size: 18px;
}
.integral {
  display: flex;
  align-items: center;
  flex-direction: row;
}
</style>
