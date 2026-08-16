<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传题目"
    width="50%"
    center
    :before-close="handleClose"
  >
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="题目" prop="question" placeholder="请输入题目">
          <el-input v-model="ruleForm.question" />
        </el-form-item>
        <el-form-item label="题目难度" prop="difficulty">
          <el-radio-group v-model="ruleForm.difficulty">
            <el-radio label="0"> 简单 </el-radio>
            <el-radio label="1"> 中等 </el-radio>
            <el-radio label="2"> 困难 </el-radio>
            <el-radio label="3"> 未知 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionType">
          <el-radio-group v-model="ruleForm.questionType">
            <el-radio label="0"> 单选题 </el-radio>
            <el-radio label="1"> 多选题 </el-radio>
            <el-radio label="2"> 判断题 </el-radio>
            <el-radio label="3"> 简答题 </el-radio>
            <el-radio label="4"> 未知 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目方向" prop="subjectID">
          <el-select v-model="ruleForm.subjectID" placeholder="请选择题目方向">
            <el-option
              v-for="item in questionType"
              :key="item.subjectID"
              :label="item.content"
              :value="item.subjectID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            class="tag"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="small"
            style="width: auto"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-if="showAddTag" size="small" @click="showInput">
            +新标签
          </el-button>
        </el-form-item>

        <el-form-item
          v-if="ruleForm.questionType"
          label="题目详情"
          class="ques-detail"
        >
          <Tinymce
            v-if="
              ruleForm.questionType === '3' || ruleForm.questionType === '4'
            "
            v-model="ruleForm.questionDetail"
            width="100%"
          />
          <div
            v-else-if="
              ruleForm.questionType === '0' || ruleForm.questionType === '1'
            "
            style="width: 100%"
          >
            <div
              v-for="(option, index) in choiceOptions"
              :key="index"
              style="margin: 0 20px 10px 0"
            >
              <el-input v-model="option.value">
                <template #prepend>{{ option.code }}</template></el-input
              >
            </div>
            <el-button type="primary" @click="addChoiceOption"
              >添加选项</el-button
            >
          </div>
          <div v-else-if="ruleForm.questionType === '2'" style="width: 100%">
            <div
              v-for="(option, index) in judgeChoice"
              :key="index"
              style="margin: 0 20px 10px 0"
            >
              <el-input v-model="option.value">
                <template #prepend>{{ option.code }}</template></el-input
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="题目答案与解析" prop="answer">
          <Tinymce v-model="ruleForm.answer" width="100%" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button
          @click="
            () => {
              resetForm(ruleFormRef);
              dynamicTags = [];
            }
          "
          >清空</el-button
        >
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  toRefs,
  computed,
  nextTick,
  watchEffect,
  defineAsyncComponent,
} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { uploadQuestion, getSubjectList } from '@/services';
import type { FormInstance, FormRules } from 'element-plus';
import type { ISubject } from '@/types';

const Tinymce = defineAsyncComponent(
  () => import('@/components/Tinymce/Tinymce.vue'),
);

const formSize = ref<'' | 'default' | 'small' | 'large'>('default');
const ruleFormRef = ref<FormInstance>();
const store = useStore();

const ruleForm = reactive({
  question: '',
  difficulty: '',
  questionType: '',
  subjectID: '',
  questionDetail: '',
  answer: '',
});

// 选择题选项（单选和多选共用）
const choiceOptions = reactive([
  { code: 'A', value: '' },
  { code: 'B', value: '' },
  { code: 'C', value: '' },
]);

// 判断题选项
const judgeChoice = reactive([
  { code: '正确', value: '' },
  { code: '错误', value: '' },
]);

// 添加选择题选项
const addChoiceOption = () => {
  const nextCode = String.fromCharCode(choiceOptions.length + 65);
  choiceOptions.push({
    code: nextCode,
    value: '',
  });
};

const questionType = ref<ISubject[]>([]);

const rules = reactive<FormRules>({
  question: [{ required: true, message: '请输入题目', trigger: 'blur' }],
  difficulty: [
    {
      required: true,
      message: '请选择难度',
      trigger: 'change',
    },
  ],
  questionType: [
    {
      required: true,
      message: '请选择题目类型',
      trigger: 'change',
    },
  ],
  subjectID: [
    {
      required: true,
      message: '请选择题目方向',
      trigger: 'change',
    },
  ],
  questionDetail: [
    {
      required: ruleForm.questionType === '3' ? false : true,
      message: '请输入题目详情',
      trigger: 'blur',
    },
  ],
  answer: [{ required: true, message: '请输入该题答案', trigger: 'blur' }],
});

const inputValue = ref('');
const dynamicTags = ref<string[]>([]);
const inputVisible = ref(false);
const InputRef = ref();

const showAddTag = computed(() => {
  if (inputVisible.value) return false;
  return dynamicTags.value.length < 5;
});

const handleCloseTag = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input?.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid: boolean) => {
    if (valid) {
      const quesDetail =
        ruleForm.questionType === '3' || ruleForm.questionType === '4'
          ? ruleForm.questionDetail
          : ruleForm.questionType === '0' || ruleForm.questionType === '1'
          ? JSON.stringify(choiceOptions)
          : JSON.stringify(judgeChoice);
      const params = {
        ...ruleForm,
        questionDetail: quesDetail,
        tags: dynamicTags.value.join(','),
        creator: store.state.userData.username || store.state.userData.name,
        userId: store.state.userData.userId as number,
      };

      uploadQuestion(params).then(() => {
        emit('update:dialogVisible', false);
        ElMessage.success('上传成功,请等待审核');
        resetForm(formEl);
        dynamicTags.value = [];
        choiceOptions.forEach((item) => {
          item.value = '';
        });
        judgeChoice.forEach((item) => {
          item.value = '';
        });
      });
    } else {
      return;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  choiceOptions.forEach((item) => {
    item.value = '';
  });
  judgeChoice.forEach((item) => {
    item.value = '';
  });
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
      // 用户取消关闭
    });
};

watchEffect(async () => {
  if (dialogVisible.value) {
    const res = await getSubjectList();
    questionType.value = res;
  }
});
</script>

<style scoped>
:deep(.el-input__validateIcon) {
  color: var(--el-color-success);
}
:deep(.el-form-item__label) {
  white-space: nowrap;
}
.tag {
  margin-right: 5px;
}
.singleChoice {
  display: flex;
  flex-direction: column;
}
.ques-detail :deep(.el-form-item__content) {
  align-items: normal;
}
</style>
