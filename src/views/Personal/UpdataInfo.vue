<template>
  <el-dialog v-model="dialogVisible" title="修改信息" width="50%" center :before-close="handleClose">
    <div>
      <el-form ref="FormRef" :model="form" :size="formSize" label-width="80px">
        <el-form-item label="昵称" prop="name" placeholder="请输入昵称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="头像">
          <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item> -->

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="简介" prop="introduction" placeholder="介绍一下自己吧">
          <el-input type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio label="0">在学校</el-radio>
            <el-radio label="1">求职</el-radio>
            <el-radio label="2">已工作</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="兴趣" prop="interesting">
          <el-input v-model="form.interesting"></el-input>

        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
    </div>


    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="
          () => {
            resetForm(FormRef);
            // dynamicTags = [];
          }
        ">清空</el-button>
        <el-button type="primary" @click="submitForm(FormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ElInput } from 'element-plus';
import { useStore } from 'vuex';
import type { FormInstance, FormRules } from 'element-plus';
import { updateUserInfo } from '@/services';

// 修改个人信息 dialogVisible
const formSize = ref('default');
const store = useStore();
const FormRef = ref<FormInstance>();


const form = reactive({
  name: '',
  introduction: '',
  sex: '',
  state: '',
  interesting: '',
  email: '',
});


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    console.log(valid, fields);
    if (valid) {
      // const params = {
      //   // ...form,
      //   phone:localStorage.getItem("uid"),
      //   // tags: dynamicTags.value.join(','), // 标签
      //   // creator: store.state.userData.username, // 创建者
      // };
      updateUserInfo({
        phone: localStorage.getItem("uid"),
        username: store.state.userData.username
      }
      ).then((res) => {
        if (res.code === 200) {
        emit('update:dialogVisible', false);
        ElMessage({
          message: '编辑成功',
          type: 'success',
        });
        resetForm(formEl);
      }else {
      ElMessage({
        message: res.message,
        type: 'error',
        duration: 3000,
      });
    }
  });
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};


const props = defineProps({
  dialogVisible: Boolean,
});
const { dialogVisible } = toRefs(props);

const emit = defineEmits(['update:dialogVisible']);
const cancel = () => {
  emit('update:dialogVisible', false);
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定离开吗?所填内容将会丢失')
    .then(() => {
      done();
      emit('update:dialogVisible', false);
    })
    .catch(() => {
      // catch error
    });
};
</script>