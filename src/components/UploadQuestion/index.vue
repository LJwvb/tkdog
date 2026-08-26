<template>
  <el-dialog v-model="dialogVisible" title="上传题目" width="60%" center :before-close="handleClose">
    <el-form label-width="90px" status-icon>
      <el-form-item label="题干" required>
        <el-input v-model="ruleForm.question" type="textarea" :rows="3" maxlength="500" show-word-limit
          placeholder="请输入题目题干" />
      </el-form-item>

      <el-form-item label="题型" required>
        <el-radio-group v-model="ruleForm.questionType">
          <el-radio-button label="0">单选题</el-radio-button>
          <el-radio-button label="1">多选题</el-radio-button>
          <el-radio-button label="2">判断题</el-radio-button>
          <el-radio-button label="3">简答题</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="难度" required>
        <el-radio-group v-model="ruleForm.difficulty">
          <el-radio-button label="0">简单</el-radio-button>
          <el-radio-button label="1">中等</el-radio-button>
          <el-radio-button label="2">困难</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属科目" required>
        <el-select v-model="ruleForm.subjectID" placeholder="请选择所属科目" style="width: 240px">
          <el-option v-for="s in subjects" :key="s.subjectID" :label="s.content" :value="s.subjectID" />
        </el-select>
      </el-form-item>

      <el-form-item label="标签">
        <div class="tag-wrap">
          <el-tag v-for="tag in dynamicTags" :key="tag" class="tag" closable @close="handleCloseTag(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" class="tag-input"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-if="showAddTag" size="small" @click="showInput">
            + 新标签
          </el-button>
        </div>
      </el-form-item>

      <!-- 单选 / 多选：选项 + 正确答案 -->
      <el-form-item v-if="isChoice" label="选项与答案" required>
        <el-radio-group v-if="isSingle" v-model="correctSingle" class="options-list">
          <div v-for="(opt, index) in choiceOptions" :key="opt.code" class="option-row">
            <span class="option-code">{{ opt.code }}</span>
            <el-input v-model="opt.value" placeholder="请输入选项内容" class="option-input" />
            <el-radio :label="opt.code" class="option-correct">正确</el-radio>
            <el-button link type="danger" :disabled="choiceOptions.length <= 2"
              @click="removeChoiceOption(index)">删除</el-button>
          </div>
        </el-radio-group>
        <el-checkbox-group v-else v-model="correctMulti" class="options-list">
          <div v-for="(opt, index) in choiceOptions" :key="opt.code" class="option-row">
            <span class="option-code">{{ opt.code }}</span>
            <el-input v-model="opt.value" placeholder="请输入选项内容" class="option-input" />
            <el-checkbox :label="opt.code" class="option-correct">正确</el-checkbox>
            <el-button link type="danger" :disabled="choiceOptions.length <= 2"
              @click="removeChoiceOption(index)">删除</el-button>
          </div>
        </el-checkbox-group>
        <el-button type="primary" plain :disabled="choiceOptions.length >= 6" @click="addChoiceOption">+
          添加选项</el-button>
      </el-form-item>

      <!-- 判断：正确答案 -->
      <el-form-item v-if="isJudge" label="正确答案" required>
        <el-radio-group v-model="judgeAnswer">
          <el-radio-button label="正确">正确</el-radio-button>
          <el-radio-button label="错误">错误</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 简答：参考答案 -->
      <el-form-item v-if="isShortAnswer" label="参考答案" required>
        <el-input v-model="ruleForm.answer" type="textarea" :rows="6" maxlength="2000" show-word-limit
          placeholder="请输入参考答案（将用于 AI 批改对照）" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="resetAll">清空</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, computed, nextTick, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { uploadQuestion, getSubjectList } from '@/services';
import type { ISubject } from '@/types';

const store = useStore();

const ruleForm = reactive({
  question: '',
  difficulty: '',
  questionType: '',
  subjectID: '' as string | number,
  answer: '',
});

// 选择题选项（单选/多选共用）
const choiceOptions = reactive([
  { code: 'A', value: '' },
  { code: 'B', value: '' },
  { code: 'C', value: '' },
  { code: 'D', value: '' },
]);
const correctSingle = ref('');
const correctMulti = ref<string[]>([]);
const judgeAnswer = ref('');

const isChoice = computed(() =>
  ['0', '1'].includes(ruleForm.questionType),
);
const isSingle = computed(() => ruleForm.questionType === '0');
const isJudge = computed(() => ruleForm.questionType === '2');
const isShortAnswer = computed(() => ruleForm.questionType === '3');

const subjects = ref<ISubject[]>([]);

// 标签
const dynamicTags = ref<string[]>([]);
const inputVisible = ref(false);
const inputValue = ref('');
const InputRef = ref();
const showAddTag = computed(() => {
  if (inputVisible.value) return false;
  return dynamicTags.value.length < 5;
});

const addChoiceOption = () => {
  if (choiceOptions.length >= 6) return;
  choiceOptions.push({
    code: String.fromCharCode(65 + choiceOptions.length),
    value: '',
  });
};

const removeChoiceOption = (index: number) => {
  if (choiceOptions.length <= 2) return;
  const removed = choiceOptions[index];
  if (correctSingle.value === removed.code) correctSingle.value = '';
  correctMulti.value = correctMulti.value.filter((c) => c !== removed.code);
  choiceOptions.splice(index, 1);
};

const handleCloseTag = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => InputRef.value?.input?.focus());
};
const handleInputConfirm = () => {
  const val = inputValue.value.trim();
  if (val && !dynamicTags.value.includes(val)) {
    dynamicTags.value.push(val);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const submitForm = () => {
  if (!ruleForm.question.trim()) {
    ElMessage.warning('请输入题干');
    return;
  }
  if (!ruleForm.questionType) {
    ElMessage.warning('请选择题型');
    return;
  }
  if (!ruleForm.difficulty) {
    ElMessage.warning('请选择难度');
    return;
  }
  if (ruleForm.subjectID === '' || ruleForm.subjectID == null) {
    ElMessage.warning('请选择所属科目');
    return;
  }

  let questionDetail = '';
  let answer = '';

  if (isChoice.value) {
    const filled = choiceOptions.filter((o) => o.value.trim());
    if (filled.length < 2) {
      ElMessage.warning('请至少填写两个选项');
      return;
    }
    if (
      choiceOptions.some((o) => !o.value.trim()) &&
      choiceOptions.some((o) => o.value.trim())
    ) {
      ElMessage.warning('存在空选项，请补全或删除空选项');
      return;
    }
    questionDetail = JSON.stringify(
      choiceOptions.map((o) => ({ code: o.code, value: o.value.trim() })),
    );
    if (isSingle.value) {
      if (!correctSingle.value) {
        ElMessage.warning('请勾选正确答案');
        return;
      }
      answer = `正确选项：${correctSingle.value}`;
    } else {
      if (!correctMulti.value.length) {
        ElMessage.warning('请勾选正确答案');
        return;
      }
      answer = `正确选项：${[...correctMulti.value].sort().join('')}`;
    }
  } else if (isJudge.value) {
    if (!judgeAnswer.value) {
      ElMessage.warning('请选择正确答案');
      return;
    }
    questionDetail = JSON.stringify([
      { code: '正确', value: '' },
      { code: '错误', value: '' },
    ]);
    answer = judgeAnswer.value;
  } else if (isShortAnswer.value) {
    if (!ruleForm.answer.trim()) {
      ElMessage.warning('请输入参考答案');
      return;
    }
    questionDetail = '';
    answer = ruleForm.answer.trim();
  } else {
    ElMessage.warning('请选择题型');
    return;
  }

  const params = {
    question: ruleForm.question.trim(),
    difficulty: ruleForm.difficulty,
    questionType: ruleForm.questionType,
    subjectID: ruleForm.subjectID,
    questionDetail,
    answer,
    tags: dynamicTags.value.join(','),
    creator: store.state.userData.username || store.state.userData.name,
    userId: store.state.userData.userId as number,
  };

  uploadQuestion(params).then(() => {
    emit('update:dialogVisible', false);
    ElMessage.success('上传成功，请等待审核');
    resetAll();
  });
};

const resetAll = () => {
  ruleForm.question = '';
  ruleForm.difficulty = '';
  ruleForm.questionType = '';
  ruleForm.subjectID = '';
  ruleForm.answer = '';
  choiceOptions.splice(
    0,
    choiceOptions.length,
    { code: 'A', value: '' },
    { code: 'B', value: '' },
    { code: 'C', value: '' },
    { code: 'D', value: '' },
  );
  correctSingle.value = '';
  correctMulti.value = [];
  judgeAnswer.value = '';
  dynamicTags.value = [];
  inputVisible.value = false;
  inputValue.value = '';
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
  ElMessageBox.confirm('确定离开吗？所填内容将会丢失')
    .then(() => {
      done();
      emit('update:dialogVisible', false);
    })
    .catch(() => {
      // 用户取消关闭
    });
};

// 切换题型时清空答案相关状态，避免串场
watch(
  () => ruleForm.questionType,
  () => {
    correctSingle.value = '';
    correctMulti.value = [];
    judgeAnswer.value = '';
    ruleForm.answer = '';
  },
);

watch(
  () => dialogVisible.value,
  async (visible) => {
    if (visible && subjects.value.length === 0) {
      subjects.value = (await getSubjectList()) ?? [];
    }
  },
);
</script>

<style scoped>
:deep(.el-form-item__label) {
  white-space: nowrap;
}

.tag-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  margin-right: 0;
}

.tag-input {
  width: 100px;
}

.options-list {
  width: 100%;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.option-code {
  width: 24px;
  color: var(--el-text-color-regular);
  text-align: center;
  flex-shrink: 0;
  font-size: 16px;
}

.option-input {
  flex: 1;
}

.option-correct {
  flex-shrink: 0;
  margin-right: 0;
}
</style>
