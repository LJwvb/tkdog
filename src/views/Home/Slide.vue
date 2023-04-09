<template>
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
          <span>
            题库狗一个干净且高级的面试刷题网站源码，支持自由组卷，通过Vue3+Node.js的全栈项目，程序包含网站前台+管理员后台
          </span>
          <el-button class="button" text @click="showModal()">
            点击了解
          </el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-card>
        <div>排行榜</div>
        <el-scrollbar height="400px">
          <el-skeleton :loading="loadingRank" animated :rows="10">
            <div v-for="(item, index) in rankData" :key="index">
              <div class="border_bottom">
                <div class="row">
                  <div class="rank">{{ index + 1 }}</div>
                  <img :src="item.avatar" alt="" class="avatar" />
                  <div class="name">{{ item.username }}</div>
                </div>
                <div class="">
                  <div class="level">获赞数：{{ item.get_likes_num }}</div>
                  <div class="role">上传数：{{ item.upload_ques_num }}</div>
                </div>
              </div>
            </div>
          </el-skeleton>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogVisibleAbout" width="400px" center title="关于本站">
    <div>
      <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />
      前端开发是当前热门的职业之一，而面试则是进入这个行业不可避免的阶段。对于应聘者来说，准备充分的面试题库是非常重要的，这可以帮助他们更好地培养技能和提升自信心。在这篇文章中，我们将介绍一个前端面试题库网站，名为“题库狗”。
      <br />
      <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />

      “题库狗”是一个专注于前端面试题库的网站。它提供了大量的面试题目，包括HTML、CSS、JavaScript等多个方面，涵盖了初级、中级和高级的难度水平，能够满足不同层次的开发者的需求。每个题目都有详细的解答，让开发者能够更好地理解和掌握相关知识点。
      <br />
      <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />

      除了提供题目和解答以外，“题库狗”还提供了组卷功能。开发者可以根据自己的需求，自由选择题目数量和知识点等，生成一份符合自己需求的面试试卷。这将有助于开发者更好地检验自己的学习成果，并更好地准备面试。
      <br />
      <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />

      此外，“题库狗”每天都会更新一道新的题目，让用户在学习和实践中不断进步。这个功能可以帮助开发者保持对前端领域的关注，及时掌握最新的知识和技术。
      <br />
      <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />

      总之，“题库狗”是一个非常优秀的前端面试题库网站。它提供了丰富的题目和解答、组卷功能以及每日更新等多种特色功能，能够帮助开发者更好地准备前端面试，进一步提升自己的职业技能。
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { getRankList, getDailyQuestion, browseQuestion } from '@/services';
import { useStore } from 'vuex';
const store = useStore();

const rankData = ref();
const dailyData = ref();
const loadingRank = ref(true);
const loadingDaily = ref(true);
const dialogVisibleAbout = ref(false);

const getRank = async () => {
  const res = await getRankList();
  rankData.value = res;
  loadingRank.value = false;
};

const getDaily = async () => {
  const res = await getDailyQuestion();
  dailyData.value = res;
  loadingDaily.value = false;
};

onMounted(() => {
  getRank();
  getDaily();
});

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
}
.text {
  margin-left: 10px;
}
.question {
  width: 90%;
  word-wrap: break-word;
}

.border_bottom {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  justify-content: space-between;
  align-items: center;
}

.info {
  text-align: left;
  text-indent: 2em;
  height: 65px;
}
.button {
  position: absolute;
  bottom: 0px;
  right: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.row {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
}
.rank {
  font-size: large;
  margin-right: 10px;
  font-weight: bold;
}
.authority {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.name {
  margin-left: 10px;
}

.el-row {
  margin-bottom: 20px;
}
</style>
