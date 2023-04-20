div
<template>
  <div class="title-small">
    <div class="comment-section">
      <el-badge :value="badgeValue" :max="10" class="badge">
        <div @click="drawerClick" class="basket-btn">评论区</div>
      </el-badge>
    </div>

    <el-drawer
      v-model="drawer"
      title="评论区"
      size="50%"
      v-model:visible="drawer"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="form"
        status-icon
      >
        <el-form-item label-width="0" prop="questionDetail">
          <el-input
            v-model="ruleForm.comment"
            maxlength="200"
            placeholder="留下你的评论吧~~~"
            show-word-limit
            autosize
            type="textarea"
            size="large"
          />
        </el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)" class="btn">
          确定
        </el-button>
      </el-form>
      <div class="comment-list">
        <div v-for="item in commentList" :key="item" class="comment-item">
          <div class="comment-text">{{ item?.content }}</div>
          <div class="comment-footer">
            <img :src="item?.avatar" alt="" class="avatar" />
            <span>{{ item?.username }}</span>
            <span>{{ transitionTime(item?.create_time) }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { addComment, getCommentList } from '@/services';
import { transitionTime } from '@/utils/index';

const store = useStore();
const drawer = ref(false);
const badgeValue = ref(0);
const commentList = ref<any>([]);
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  comment: '',
});
const rules = reactive<FormRules>({
  comment: [
    {
      required: true,
      message: '请输入评论内容',
      trigger: 'blur',
    },
  ],
});
const getComment = () => {
  getCommentList({}).then((res) => {
    commentList.value = res?.data;
    badgeValue.value = res?.data.length;
  });
};
watchEffect(() => {
  getComment();
});

const drawerClick = () => {
  drawer.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        userId: store.state.userData?.userId,
        content: ruleForm.comment,
      };
      addComment(params).then((res) => {
        if (res?.code === 200) {
          ElMessage.success('评论成功');
          ruleForm.comment = '';
          getComment();
        }
      });
    } else {
      return false;
    }
  });
};
</script>
<style scoped>
.comment-section {
  position: fixed;
  bottom: 280px;
  right: 5px;
  width: 25px;
}
.form {
  position: relative;
}

::v-deep .el-badge__content.is-fixed {
  transform: translateY(-50%) translateX(-50%);
}
.basket-btn {
  width: 25px;
  background-color: #409eff;
  color: #fff;
  border-radius: 3px;
  text-align: center;
  padding: 15px 5px 15px 2px;
}
.btn {
  position: absolute;
  right: 0px;
}
.comment-list {
  margin-top: 80px;
}
.comment-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.comment-text {
}
.comment-footer {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.comment-footer span {
  margin-left: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
