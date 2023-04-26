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
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
            style="width: auto"
          />
          <el-button v-if="showAddTag" size="small" @click="showInput">
            +新标签
          </el-button>
        </el-form-item>

        <el-form-item
          label="题目详情"
          v-if="ruleForm.questionType"
          class="ques-detail"
        >
          <Tinymce
            v-model="ruleForm.questionDetail"
            width="100%"
            v-if="
              ruleForm.questionType === '3' || ruleForm.questionType === '4'
            "
          />
          <div v-else-if="ruleForm.questionType === '0'" style="width: 100%">
            <div
              v-for="(option, index) in singleChoice"
              :key="index"
              style="margin: 0 20px 10px 0"
            >
              <el-input v-model="option.value">
                <template #prepend>{{ option.code }}</template></el-input
              >
            </div>
            <el-button type="primary" @click="addSingleChoiceOption"
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
  onMounted,
  defineProps,
  nextTick,
  watchEffect,
} from 'vue';
import Tinymce from '@/components/Tinymce/Tinymce.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { uploadQuestion, getSubjectList } from '@/services';
import type { FormInstance, FormRules } from 'element-plus';
const formSize = ref('default');
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
// 单选题选项
const singleChoice = reactive([
  { code: 'A', value: '' },
  { code: 'B', value: '' },
  { code: 'C', value: '' },
]);
//判断题选项
const judgeChoice = reactive([
  { code: '正确', value: '' },
  { code: '错误', value: '' },
]);
// 添加单选题选项
const addSingleChoiceOption = () => {
  const nextCode = String.fromCharCode(singleChoice.length + 65);
  singleChoice.push({
    code: nextCode,
    value: '',
  });
};
const questionType = ref<any>([]);

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
const dynamicTags: any = ref([]);
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const quesDetail =
        ruleForm.questionType === '3' || ruleForm.questionType === '4'
          ? ruleForm.questionDetail
          : ruleForm.questionType === '1'
          ? JSON.stringify(singleChoice)
          : JSON.stringify(judgeChoice);
      const params = {
        ...ruleForm,
        questionDetail: quesDetail,
        tags: dynamicTags.value.join(','), // 标签
        creator: store.state.userData.username, // 创建者
      };

      uploadQuestion(params).then((res: any) => {
        emit('update:dialogVisible', false);
        ElMessage.success(res.message);
        resetForm(formEl);
        dynamicTags.value = [];
        // 清空单选题选项
        singleChoice.forEach((item) => {
          item.value = '';
        });
        // 清空判断题选项
        judgeChoice.forEach((item) => {
          item.value = '';
        });
      });
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  singleChoice.forEach((item) => {
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
      // catch error
    });
};
watchEffect(async () => {
  if (dialogVisible.value) {
    const res = await getSubjectList();
    questionType.value = res.data;
  }
});
</script>

<style scoped>
::v-deep .el-input__validateIcon {
  color: var(--el-color-success);
}
::v-deep .el-form-item__label {
  white-space: nowrap;
}
.tag {
  margin-right: 5px;
}
.singleChoice {
  display: flex;
  flex-direction: column;
}
.ques-detail ::v-deep .el-form-item__content {
  align-items: normal;
}
</style>
