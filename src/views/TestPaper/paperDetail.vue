<template>
  <div class="info-container">
    <div class="page-header">
      <el-button class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回试卷列表</span>
      </el-button>
    </div>
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
          <div v-show="answerOpen[item.id]" class="question-answer">
            <div
              v-if="item.answer"
              v-html="
                formatAnswerWithValues(
                  item.questionType,
                  item.answer,
                  item.questionDetail,
                )
              "
            ></div>
            <!-- eslint-enable vue/no-v-html -->
            <div v-else class="answer-tip">
              该试卷答案仅作者本人或管理员可见
            </div>
          </div>
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
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { getPaperDetail } from '@/services';
import {
  parseHashQuery,
  transitionTime,
  firstQueryValue,
  exportPaperToWord,
  parsePaperOptions,
  formatAnswerWithValues,
} from '@/utils';
import type { IQuestion } from '@/types';
import {
  Avatar,
  ArrowUpBold,
  ArrowDownBold,
  ArrowLeft,
} from '@element-plus/icons-vue';
import { PaperPurview } from '@/types';

interface IPaperDetailInfo {
  paper_title?: string;
  paper_tags?: string | string[];
  author?: string;
  ctime?: string;
  purview?: number;
}

const { paperID } = parseHashQuery();
const router = useRouter();
const paperDetail = ref<IQuestion[]>([]);
const paperInfo = ref<IPaperDetailInfo>({});
// 答案展开状态（默认全部收起）
const answerOpen = ref<Record<number, boolean>>({});

// 游客（未登录）展开答案时给出说明：后端对未登录强制隐藏答案
const store = useStore();
const toggleAnswer = (id: number) => {
  const isLoggedIn = Boolean(store.state.userData?.phone);
  if (!isLoggedIn) {
    ElMessage.warning('登录后可查看答案，请先登录');
    return;
  }
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
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/testPaper');
  }
};
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
  flex-shrink: 0;
}

.watermark {
  position: absolute;
  top: 12px;
  right: 12px;
  transform: rotate(-15deg);
  color: #909399;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

/* 暗色模式下水印：html 选择器在 scoped 下无效，规则放在文件末尾的全局样式块 */

/* 确保卡片容器有相对定位 */
:deep(.el-card__body) {
  position: relative;
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

.answer-tip {
  color: #909399;
  font-size: 13px;
}

.slide-container {
  width: 30%;
  margin-left: 20px;
  position: sticky;
  top: 130px;
  align-self: flex-start;
  height: fit-content;
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

/* 页面顶部返回按钮 */
.page-header {
  margin-bottom: 16px;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
}

/* 返回按钮 - sticky 内联，左右对齐 */
.page-header {
  position: sticky;
  top: 60px;
  z-index: 30;
  margin-bottom: 16px;
  padding: 4px 0;
}
.page-header .back-btn {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  transition: all 0.2s;
}
.page-header .back-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}
</style>

<!-- 全局样式：html/body 级选择器在 scoped 块中会被加上 [data-v-xxx] 前缀而失效 -->
<style>
html.dark .watermark {
  color: #a3a6ad;
  border-color: #3a3b3c;
  background-color: rgba(29, 30, 31, 0.9);
}
</style>
