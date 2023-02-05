<template>
  <div>
    <div class="colonn" style="padding: 20px 20px 20px 0">
      <el-card class="box-card">
        <div class="roww background1">
          <img src="../../assets/dog1.jpg" class="logo1" />
          <div class="colonn">
            <div class="roww">
              <div class="name">qiqilog</div>
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
              <el-button
                class="el-icon-edit"
                @click="dialogFormVisibleClicl"
                type="text"
              >
                编辑</el-button
              >
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
              <div style="text-align: left">男</div>
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
            <div class="tags" style="display: flex; padding-bottom: 20px">
              <el-tag>Tag 1</el-tag>
              <el-tag class="ml-2" type="success">Tag 2</el-tag>
              <el-tag class="ml-2" type="info">Tag 3</el-tag>
              <el-tag class="ml-2" type="warning">Tag 4</el-tag>
              <el-tag class="ml-2" type="danger">Tag 5</el-tag>
            </div>
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
              <div style="text-align: left">无</div>
            </el-col>
          </el-row>

          <el-row class="padding23">
            <el-col :span="2">
              <div class="grid-content">注册时间</div>
            </el-col>
            <el-col :span="21">
              <div style="text-align: left">无</div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <shitilan></shitilan>

    <!-- 修改个人信息 -->
    <el-dialog title="修改信息" v-model="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="性别">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="男" name="type"></el-checkbox>
            <el-checkbox label="女" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="简介">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="在学校"></el-radio>
            <el-radio label="求职中"></el-radio>
            <el-radio label="已工作"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="兴趣">
          <el-select
            multiple
            style="width: 100%"
            v-model="value"
            placeholder="请选择"
          >
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import shitilan from '@/components/shitilan.vue';
import { ref, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ElInput } from 'element-plus';
import type { UploadProps } from 'element-plus';
// 修改个人信息 dialogFormVisible
const dialogFormVisible = ref(false);
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const formLabelWidth = ref('120px');
const checkList = ref(['选中且禁用', '复选框 A']);
const dynamicTags = ref(['标签一', '标签二', '标签三']);
const inputVisible = ref(false);
const inputValue = ref('');
const InputRef = ref<InstanceType<typeof ElInput>>();

const options = reactive([
  {
    label: '热门城市',
    options: [
      {
        value: 'Shanghai',
        label: '上海',
      },
      {
        value: 'Beijing',
        label: '北京',
      },
    ],
  },
  {
    label: '城市名',
    options: [
      {
        value: 'Chengdu',
        label: '成都',
      },
      {
        value: 'Shenzhen',
        label: '深圳',
      },
      {
        value: 'Guangzhou',
        label: '广州',
      },
      {
        value: 'Dalian',
        label: '大连',
      },
    ],
  },
]);
const value = ref('');
const dialogFormVisibleClicl = () => {
  dialogFormVisible.value = !dialogFormVisible.value;
};
const imageUrl = ref('');

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};

//标签
const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
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
