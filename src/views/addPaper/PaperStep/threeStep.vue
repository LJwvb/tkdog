<template>
  <el-card class="smart-pick">
    <div class="pick-header">
      <el-button type="primary" @click="togglePick">智能抽题</el-button>
      <span class="pick-tip"
        >按题型数量自动从已审核题库随机抽题，加入下方试卷</span
      >
    </div>
    <el-form v-if="showPick" inline class="pick-form">
      <el-form-item label="科目">
        <el-select
          v-model="pickForm.subjectID"
          clearable
          placeholder="全部科目"
          style="width: 150px"
        >
          <el-option
            v-for="s in subjectList"
            :key="s.subjectID"
            :label="s.content"
            :value="s.subjectID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="难度">
        <el-select
          v-model="pickForm.difficulty"
          clearable
          placeholder="全部难度"
          style="width: 120px"
        >
          <el-option label="简单" :value="0" />
          <el-option label="中等" :value="1" />
          <el-option label="困难" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="单选">
        <el-input-number v-model="pickForm.single" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="多选">
        <el-input-number v-model="pickForm.multiple" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="判断">
        <el-input-number v-model="pickForm.judge" :min="0" :max="50" />
      </el-form-item>
      <el-form-item label="简答">
        <el-input-number v-model="pickForm.essay" :min="0" :max="50" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" :loading="picking" @click="doPick">
          抽题并加入
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <QuestionCard
    v-for="item in questionList"
    :key="item.id"
    :question="item"
    type="paper"
  />
  <el-empty
    v-if="questionList.length === 0"
    :image-size="200"
    description="题目列表为空,快去添加题目呀~"
  >
    <el-button type="primary" @click="addQuestion">手动添加题目</el-button>
  </el-empty>

  <el-button class="prev-step" type="primary" @click="prevStep"
    >上一步</el-button
  >
  <el-button
    v-if="questionList.length !== 0"
    class="next-step"
    type="primary"
    @click="nextStep"
    >创建试卷</el-button
  >
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import QuestionCard from '@/components/QuestionCard/index.vue';
import { randomPickQuestions, getSubjectList } from '@/services';
import { ElMessage } from 'element-plus';
import type { ISubject, IQuestion } from '@/types';
import router from '@/router';

const store = useStore();

const questionList = computed(() => store.state.selectedTopic as IQuestion[]);

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'next'): void;
  (e: 'prev'): void;
}>();

// 智能抽题
const showPick = ref(false);
const picking = ref(false);
const subjectList = ref<ISubject[]>([]);
const pickForm = reactive({
  subjectID: '' as string | number,
  difficulty: '' as string | number,
  single: 5,
  multiple: 0,
  judge: 0,
  essay: 0,
});

const togglePick = () => {
  showPick.value = !showPick.value;
};

const doPick = async () => {
  picking.value = true;
  try {
    const res = await randomPickQuestions({
      subjectID: pickForm.subjectID === '' ? undefined : pickForm.subjectID,
      difficulty: pickForm.difficulty === '' ? undefined : pickForm.difficulty,
      counts: {
        single: pickForm.single,
        multiple: pickForm.multiple,
        judge: pickForm.judge,
        essay: pickForm.essay,
      },
    });
    if (res && res.length) {
      const existing = store.state.selectedTopic as IQuestion[];
      const existingIds = new Set(existing.map((q) => q.id));
      const fresh = res.filter((q) => !existingIds.has(q.id));
      store.commit('setSelectedTopic', [...existing, ...fresh]);
      ElMessage.success(`抽题成功，新增 ${fresh.length} 道题目`);
    } else {
      ElMessage.warning('没有抽到符合条件的题目，请调整条件');
    }
  } finally {
    picking.value = false;
  }
};

const prevStep = () => {
  emit('prev');
};

const nextStep = () => {
  emit('next');
  emit('done');
};
const addQuestion = () => {
  if (store.state.userData.isAdmin) {
    router.push({
      path: '/adminQuestion',
      query: {
        index: 'chk',
      },
    });
  } else {
    router.push('/questionPage');
  }
};

onMounted(async () => {
  try {
    subjectList.value = await getSubjectList();
  } catch {
    // 科目列表加载失败不影响抽题
  }
});
</script>

<style scoped>
.smart-pick {
  margin-bottom: 16px;
}
.pick-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.pick-tip {
  font-size: 13px;
  color: #909399;
}
.pick-form :deep(.el-form-item) {
  margin-bottom: 8px;
}
.prev-step {
  margin-top: 16px;
}
.next-step {
  margin-top: 16px;
}
</style>
