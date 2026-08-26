<template>
  <div class="info-container">
    <el-card style="margin-bottom: 20px">
      <div
        v-for="(item, index) in paperDetail"
        :key="item.id"
        class="question-block"
      >
        <div class="question-title">
          <h2 style="display: inline">{{ index + 1 }}.</h2>
          {{ item.question }}
        </div>
        <!-- 选择题选项 -->
        <div v-if="optionList(item).length" class="options-list">
          <div
            v-for="opt in optionList(item)"
            :key="opt.code"
            class="option-row"
          >
            {{ opt.code }}. {{ opt.value }}
          </div>
        </div>
        <!-- 答案与解析：默认收起 -->
        <div class="answer-block">
          <div class="answer-header" @click="toggleAnswer(item.id)">
            <span>答案与解析</span>
            <el-icon>
              <ArrowUpBold v-if="answerOpen[item.id]" />
              <ArrowDownBold v-else />
            </el-icon>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-show="answerOpen[item.id]"
            class="question-answer"
            v-html="
              formatAnswerWithValues(
                item.questionType,
                item.answer,
                item.questionDetail,
              )
            "
          ></div>
          <!-- eslint-enable vue/no-v-html -->
        </div>
      </div>
      <div class="watermark">{{ name }}</div>
    </el-card>
  </div>
  <div class="slide-container">
    <el-card style="margin-bottom: 20px">
      <div class="paper-info">
        <h4>试卷信息</h4>
        <div>标题：{{ paperInfo?.paper_title }}</div>
        <div v-if="tags.length > 0" class="tags">
          标签：
          <el-tag v-for="tag in tags" :key="tag" class="tag-item">
            {{ tag }}
          </el-tag>
        </div>
        <div>发布时间：{{ addDate }}</div>
        <div class="creator">
          <div>上传者：</div>
          <div class="creator-info">
            <el-icon>
              <Avatar />
            </el-icon>
            <div style="margin-left: 5px">{{ paperInfo?.author }}</div>
          </div>
          <div class="allline"></div>
        </div>
        <el-button type="primary" class="do-paper-btn" @click="goDoPaper">
          开始答题
        </el-button>
        <el-button class="do-paper-btn" @click="exportWord"
          >导出 Word</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPaperDetail } from '@/services';
import queryString from 'query-string';
import {
  transitionTime,
  firstQueryValue,
  exportPaperToWord,
  parsePaperOptions,
  formatAnswerWithValues,
} from '@/utils';
import type { IQuestion } from '@/types';
import { Avatar, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';
import { PaperPurview } from '@/types';

interface IPaperDetailInfo {
  paper_title?: string;
  paper_tags?: string | string[];
  author?: string;
  ctime?: string;
  purview?: number;
}

const { paperID } = queryString.parse(
  window?.location?.href?.split('?')[1] || '',
);
const router = useRouter();
const paperDetail = ref<IQuestion[]>([]);
const paperInfo = ref<IPaperDetailInfo>({});
// 答案展开状态（默认全部收起）
const answerOpen = ref<Record<number, boolean>>({});

const toggleAnswer = (id: number) => {
  answerOpen.value = { ...answerOpen.value, [id]: !answerOpen.value[id] };
};

const optionList = (item: IQuestion) => {
  const qt = Number(item.questionType);
  if (qt === 0 || qt === 1) return parsePaperOptions(item.questionDetail);
  return [];
};

onMounted(async () => {
  const res = await getPaperDetail({ paperId: firstQueryValue(paperID) });
  paperDetail.value = res?.questions;
  paperInfo.value = res?.paperInfo as unknown as IPaperDetailInfo;
});
const addDate = computed(() => {
  return transitionTime(paperInfo.value?.ctime);
});
const tags = computed<string[]>(() => {
  const paperTags = paperInfo.value?.paper_tags;
  if (Array.isArray(paperTags)) {
    return paperTags.filter((item: string) => item !== '');
  }
  return paperTags
    ? paperTags.split(',').filter((item: string) => item !== '')
    : [];
});
const name = computed(() => {
  return paperInfo.value?.purview === PaperPurview.Public
    ? '公开试卷'
    : '个人试卷';
});
const goDoPaper = () => {
  router.push({
    path: '/testPaper/doPaper',
    query: {
      paperID: firstQueryValue(paperID),
    },
  });
};
const exportWord = () => {
  exportPaperToWord(paperInfo.value?.paper_title || '试卷', paperDetail.value);
};
</script>

<style scoped>
.info-container {
  width: 70%;
  position: relative;
}

.watermark {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: rotate(-45deg);
  color: #ccc;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.question-block {
  margin-bottom: 24px;
}

.question-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.options-list {
  margin-bottom: 12px;
}

.option-row {
  font-size: 15px;
  line-height: 26px;
  color: #333;
}

.answer-block {
  border-top: 1px dashed #eee;
  padding-top: 8px;
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
  user-select: none;
}

.question-answer {
  margin-top: 8px;
  padding: 10px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
}

.slide-container {
  width: 30%;
  margin-left: 20px;
}

.paper-info {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.do-paper-btn {
  width: 100%;
}

.creator {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.creator-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.tag-item {
  margin-right: 10px;
}
</style>
