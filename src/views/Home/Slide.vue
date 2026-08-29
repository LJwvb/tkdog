<template>
  <el-row v-if="announcements.length">
    <el-col :span="24">
      <el-card class="announce-card">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Bell />
            </el-icon>
            <span class="text">公告</span>
          </div>
        </template>
        <div
          v-for="a in announcements.slice(0, 3)"
          :key="a.id"
          class="announce-item"
        >
          <div class="announce-title">{{ a.title }}</div>
          <div v-if="a.content" class="announce-content">{{ a.content }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-card class="first">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Lollipop />
            </el-icon>
            <span class="text">题库狗的每日一题</span>
          </div>
        </template>
        <el-skeleton :loading="loadingDaily" animated :rows="0">
          <div v-for="item in dailyData" :key="item.id" class="question">
            {{ item?.question }}
          </div>
          <el-button class="button" text @click="goDaily"> 点击了解 </el-button>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-card class="second">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Lollipop />
            </el-icon>
            <span class="text">关于本站</span>
          </div>
        </template>
        <div class="info">
          <div class="about-list">
            <div class="about-item">海量前端面试题 · 多题型</div>
            <div class="about-item">自由组卷 · 在线作答 · 自动判分</div>
            <div class="about-item">错题本 / 收藏 / 排行榜 / 积分</div>
            <div class="about-item">Vue3 + Node.js 全栈</div>
          </div>
          <el-button class="button" text @click="showModal()">
            了解更多
          </el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-card class="third">
        <div class="rank-header">
          <span>排行榜</span>
          <el-radio-group v-model="rankType" size="small" @change="getRank">
            <el-radio-button label="all">总榜</el-radio-button>
            <el-radio-button label="week">周榜</el-radio-button>
            <el-radio-button label="month">月榜</el-radio-button>
          </el-radio-group>
        </div>
        <VirtualList
          v-if="rankList.length > 0 || rankLoading"
          :data="rankList"
          :height="0"
          :estimated-item-height="60"
          :loading="rankLoading"
          :finished="rankFinished"
        >
          <template #default="{ item, index }">
            <div class="border_bottom" :class="{ 'my-rank': isMyRank(item) }">
              <div class="row">
                <div class="rank">{{ index + 1 }}</div>
                <img :src="item.avatar" alt="" loading="lazy" class="avatar" />
                <div class="name">{{ item.username }}</div>
              </div>
              <div class="level">
                <div class="level-integral">积分：{{ item.integral ?? 0 }}</div>
                <div v-if="item?.get_likes_num > 0">
                  获赞数：{{ item.get_likes_num }}
                </div>
                <div v-if="item.upload_ques_num > 0">
                  上传数：{{ item.upload_ques_num }}
                </div>
              </div>
            </div>
          </template>
        </VirtualList>
        <el-empty v-else description="暂无没有用户上榜" />
        <!-- 我的排名：固定在底部 -->
        <div v-if="myRankInfo" class="my-rank-footer">
          <div class="border_bottom my-rank">
            <div class="row">
              <div class="rank">
                {{ myRankInfo.rank <= 100 ? myRankInfo.rank : '未上榜' }}
              </div>
              <img :src="myRankInfo.avatar" alt="" class="avatar" />
              <div class="name">
                {{ myRankInfo.username }}<span class="me-tag">我</span>
              </div>
            </div>
            <div class="level">
              <div class="level-integral">
                积分：{{ myRankInfo.integral ?? 0 }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogVisibleAbout" width="400px" center title="关于本站">
    <div>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      前端开发是当前热门的职业之一，而面试则是进入这个行业不可避免的阶段。对于应聘者来说，准备充分的面试题库是非常重要的，这可以帮助他们更好地培养技能和提升自信心。在这篇文章中，我们将介绍一个前端面试题库网站，名为“题库狗”。
      <br />
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

      “题库狗”是一个专注于前端面试题库的网站。它提供了大量的面试题目，包括HTML、CSS、JavaScript等多个方面，涵盖了初级、中级和高级的难度水平，能够满足不同层次的开发者的需求。每个题目都有详细的解答，让开发者能够更好地理解和掌握相关知识点。
      <br />
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

      除了提供题目和解答以外，“题库狗”还提供了组卷功能。开发者可以根据自己的需求，自由选择题目数量和知识点等，生成一份符合自己需求的面试试卷。这将有助于开发者更好地检验自己的学习成果，并更好地准备面试。
      <br />
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

      此外，“题库狗”每天都会更新一道新的题目，让用户在学习和实践中不断进步。这个功能可以帮助开发者保持对前端领域的关注，及时掌握最新的知识和技术。
      <br />
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

      总之，“题库狗”是一个非常优秀的前端面试题库网站。它提供了丰富的题目和解答、组卷功能以及每日更新等多种特色功能，能够帮助开发者更好地准备前端面试，进一步提升自己的职业技能。
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import router from '@/router';
import {
  getRankList,
  getDailyQuestion,
  browseQuestion,
  getAnnouncements,
} from '@/services';
import { useStore } from 'vuex';
import { Lollipop, Bell } from '@element-plus/icons-vue';
import type { IAnnouncement } from '@/types';
import VirtualList from '@/components/VirtualList/index.vue';
const store = useStore();

const dailyData = ref();
const loadingDaily = ref(true);
const dialogVisibleAbout = ref(false);
const rankType = ref<'all' | 'week' | 'month'>('all');
const announcements = ref<IAnnouncement[]>([]);

// 排行榜数据（只显示前100名）
const rankList = ref<any[]>([]);
const rankLoading = ref(false);
const rankFinished = ref(false);
const rankCurrentPage = ref(0);
const rankPageSize = 100;
const MAX_RANK = 100;

// 当前用户信息
const currentUser = computed(() => store.state.userData);

// 我的排名信息
const myRankInfo = computed(() => {
  if (!currentUser.value?.username) return null;
  // 在前100名中查找
  const index = rankList.value.findIndex(
    (item) => item.username === currentUser.value.username,
  );
  if (index >= 0) {
    return {
      ...rankList.value[index],
      rank: index + 1,
    };
  }
  // 不在前100名，显示用户基本信息，排名为"未上榜"
  return {
    username: currentUser.value.username,
    avatar: currentUser.value.avatar || '',
    integral: currentUser.value.integral ?? 0,
    rank: 999,
  };
});

// 判断是否是当前用户
const isMyRank = (item: any) => {
  return item.username === currentUser.value?.username;
};

// 加载排行榜数据（只加载前100名）
const loadRankData = async (page: number, append = false) => {
  if (rankLoading.value) return;
  rankLoading.value = true;
  try {
    const res = await getRankList(rankType.value, page, rankPageSize);
    if (res && res.list) {
      let list = res.list;
      // 只保留前100名
      if (list.length > MAX_RANK) {
        list = list.slice(0, MAX_RANK);
      }
      if (append) {
        rankList.value = [...rankList.value, ...list];
      } else {
        rankList.value = list;
      }
      rankFinished.value = !res.hasMore || rankList.value.length >= MAX_RANK;
      rankCurrentPage.value = page;
    }
  } finally {
    rankLoading.value = false;
  }
};

// 切换排行榜类型时重新加载（不清空列表，避免高度变化导致抖动）
const getRank = async () => {
  rankFinished.value = false;
  rankCurrentPage.value = 0;
  // 直接加载新数据覆盖，加载过程中虚拟列表显示 loading 状态
  await loadRankData(1);
};

onMounted(() => {
  getRank();
  getDaily();
  loadAnnouncements();
});

const getDaily = async () => {
  const res = await getDailyQuestion();
  dailyData.value = res;
  loadingDaily.value = false;
};

const loadAnnouncements = async () => {
  try {
    announcements.value = (await getAnnouncements()) ?? [];
  } catch {
    announcements.value = [];
  }
};

const showModal = () => {
  dialogVisibleAbout.value = true;
};
const goDaily = () => {
  const id = dailyData.value[0].id;
  router.push({
    path: `/problemInfo`,
    query: {
      id,
      type: 'daily',
    },
  });
  const setBrowseTopicsId = store.state.browseTopicsId;
  const setBrowseTopicsIds = setBrowseTopicsId.map((item: string) => item);
  if (!setBrowseTopicsIds.includes(id)) {
    store.commit('setBrowseTopicsId', [...store.state.browseTopicsId, id]);
    browseQuestion({ id, username: store.state.userData.username });
  }
};
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
}
.text {
  margin-left: 8px;
  font-size: 15px;
}
.announce-card {
  margin-bottom: 16px;
}
.announce-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}
.announce-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.announce-item:first-child {
  padding-top: 0;
}
.announce-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
.announce-content {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}
.question {
  width: 100%;
  word-wrap: break-word;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  margin-bottom: 8px;
}

.border_bottom {
  display: flex;
  border-bottom: 1px solid #f0f2f5;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 8px;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
}
.border_bottom:last-child {
  border-bottom: none;
}

.info {
  text-align: left;
  height: auto;
  min-height: auto;
  position: relative;
  padding-bottom: 0;
}
.about-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.about-item {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}
.button {
  position: static;
  display: block;
  margin-left: auto;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.rank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: #303133;
  font-size: 15px;
}

/* 排行榜卡片固定高度，避免切换时高度变化导致页面抖动 */
.third :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 480px;
  padding: 16px;
  box-sizing: border-box;
}

.third .rank-header {
  flex-shrink: 0;
}

.third .virtual-list-container {
  flex: 1;
  min-height: 0;
}

.third .my-rank-footer {
  flex-shrink: 0;
  margin-top: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .third :deep(.el-card__body) {
    height: 350px;
  }
}
.row {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0;
  min-width: 0;
  flex: 1;
}
.rank {
  font-size: 16px;
  margin-right: 10px;
  font-weight: 700;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  color: #909399;
}
/* 前三名特殊颜色 */
.border_bottom:nth-child(1) .rank {
  color: #e6a23c;
}
.border_bottom:nth-child(2) .rank {
  color: #a8abb2;
}
.border_bottom:nth-child(3) .rank {
  color: #d4a373;
}
.level {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  flex-shrink: 0;
}
.level-integral {
  color: #e6a23c;
  font-weight: 600;
  font-size: 14px;
}
.level > div:not(.level-integral) {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
.authority {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.name {
  margin-left: 10px;
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.me-tag {
  display: inline-block;
  padding: 1px 6px;
  font-size: 11px;
  background: #409eff;
  color: #fff;
  border-radius: 3px;
  flex-shrink: 0;
}

/* 我的排名高亮 */
.border_bottom.my-rank {
  background: rgba(64, 158, 255, 0.08);
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 8px;
}

/* 底部固定的我的排名 */
.my-rank-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 2px solid #e4e7ed;
  position: relative;
}

.my-rank-footer::before {
  content: '我的排名';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  color: #909399;
}

.el-row {
  margin-bottom: 16px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.rank-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  font-size: 13px;
  color: #909399;
  gap: 8px;
}
.rank-finished {
  text-align: center;
  padding: 16px 0;
  font-size: 13px;
  color: #c0c4cc;
}
</style>
