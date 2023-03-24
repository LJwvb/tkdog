<template>
  <div>
    <div class="colonn">
      <el-card class="box-card">
        <div class="roww background1">
          <img src="../../assets/dog1.jpg" class="logo1" />
          <div class="colonn">
            <div class="roww">
              <div class="name">{{username}}</div>
              <div class="biaoqian2" style="margin-left: 15px">最新</div>
            </div>
            <div style="margin-top: 15px; color: darkgray">暂无个人简介</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 20px">
        <div class="colonn background1" style="margin-top: 30px">
          <div class="rowsb padding23 border_bottom center_center">
            <div>信息</div>
            <div>
              <el-button class="el-icon-edit" @click="dialogVisibleClick" type="text">
                编辑
                <Edit />
              </el-button>
            </div>
          </div>
          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">积分</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">6</div>
            </el-col>
          </el-row>
          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">性别</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">{{ sex=="0"?"男":"女" }}</div>
            </el-col>
          </el-row>
          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">简介</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">无</div>
            </el-col>
          </el-row>

          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">兴趣</div>
            </el-col>
            <div style="text-align: left">无</div>
            <!-- <div class="tags" style="display: flex; padding-bottom: 20px">
              <el-tag>Tag 1</el-tag>
              <el-tag class="ml-2" type="success">Tag 2</el-tag>
              <el-tag class="ml-2" type="info">Tag 3</el-tag>
              <el-tag class="ml-2" type="warning">Tag 4</el-tag>
              <el-tag class="ml-2" type="danger">Tag 5</el-tag>
            </div> -->
          </el-row>

          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">状态</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">无</div>
            </el-col>
          </el-row>

          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">邮箱</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">{{email}}</div>
            </el-col>
          </el-row>

          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">注册时间</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">{{ctime}}</div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <UpdataInfo v-model:dialogVisible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import UpdataInfo from '@/views/Personal/UpdataInfo.vue';
import { transitionTime } from '@/utils';


const dialogVisible = ref(false);
const store = useStore();

const dialogVisibleClick = () => {
  dialogVisible.value = true;
};
const ctime = computed(() => {
  return transitionTime(store.state.userData.ctime);
});
const username= store.state.userData.username
const email=store.state.userData.email
const sex=store.state.userData.sex
const avatar=store.state.userData.avatar
//上传头像
// const handleAvatarSuccess: UploadProps['onSuccess'] = (
//   response,
//   uploadFile,
// ) => {
//   imageUrl.value = URL.createObjectURL(uploadFile.raw!);
// };

// const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
//   if (rawFile.type !== 'image/jpeg') {
//     ElMessage.error('Avatar picture must be JPG format!');
//     return false;
//   } else if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error('Avatar picture size can not exceed 2MB!');
//     return false;
//   }
//   return true;
// };

//标签
// const showInput = () => {
//   inputVisible.value = true;
//   nextTick(() => {
//     InputRef.value!.input!.focus();
//   });
// };
// const handleInputConfirm = () => {
//   if (inputValue.value) {
//     dynamicTags.value.push(inputValue.value);
//   }
//   inputVisible.value = false;
//   inputValue.value = '';
// };
</script>

<style scoped>
.logo1 {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  border-radius: 50%;
}

.padding23 {
  padding: 20px 20px 20px 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid white;
}

.name {
  font-size: 20px;
  font-weight: bold;
}

.biaoqian2 {
  padding: 0px 12px;
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
  color: #389e0d;
  background: #f6ffed;
  border: 1px solid #389e0d;
}

.biaoqian1 {
  padding: 0px 12px;
  font-size: 12px;
  background-color: #f5f5f5;
  color: #000000;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  margin-right: 15px;
}
</style>
