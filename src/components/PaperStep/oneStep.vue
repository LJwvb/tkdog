<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" label-position="left">
    <el-form-item label="试卷名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="如:腾讯前端一面"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" placeholder="请对试卷进行简单描述"></el-input>
    </el-form-item>
    <el-form-item label="标签">
      <el-tag v-for="tag in dynamicTags" :key="tag" class="tag" closable :disable-transitions="false"
        @close="handleCloseTag(tag)">
        {{ tag }}
      </el-tag>
      <el-input v-model="inputValue" v-if="inputVisible" ref="saveTagInputRef" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" style="width: auto">
      </el-input>
      <el-button v-if="showAddTag" size="small" @click="showInput">
        + 新标签
      </el-button>
    </el-form-item>
    <el-form-item label="权限" prop="auth">
      <el-radio-group v-model="ruleForm.auth">
        <el-radio label="0">私有</el-radio>
        <el-radio label="1">公开</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <el-button class="next-step" @click="nextStep" type="primary">下一步</el-button>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed, defineProps } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

const store = useStore();

const ruleForm = reactive({
  name: store.state.paperInfo.name || '',
  desc: store.state.paperInfo.desc || '',
  auth: store.state.paperInfo.auth || '',
});
const rules = reactive({
  name: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入试卷描述', trigger: 'blur' }],
  auth: [{ required: true, message: '请选择试卷权限', trigger: 'blur' }],
});
const dynamicTags: any = ref(store.state.paperInfo.dynamicTags || []);
const inputVisible = ref(false);
const inputValue = ref('');
const saveTagInputRef = ref();
const ruleFormRef = ref<FormInstance>();
const props = defineProps<{
  clickNext: () => void;
}>();
const showAddTag = computed(() => {
  if (inputVisible.value) return false;
  return dynamicTags.value.length < 5;
});
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    saveTagInputRef.value!.input!.focus();
  });
};

const handleCloseTag = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const nextStep = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      store.commit('setPaperInfo', {
        ...ruleForm,
        dynamicTags: dynamicTags.value,
      });
      props.clickNext();
    } else {
      ElMessage.error('请完善试卷信息');
      return false;
    }
  });
};
</script>

<style scoped>
.step {
  padding-top: 20px;
}

.tag {
  margin-right: 10px;
}
</style>
