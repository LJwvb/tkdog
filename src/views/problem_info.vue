<template>
  <div class="info-container">
    <!-- 题目详情 -->
    <el-container>
      <el-main style="padding: 30px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card>
              <div class="grid-content">
                <div class="colonn">
                  <div class="rowsb border_bottom background1 center_center" style="padding: 20px">
                    <div class="roww center_center">
                      <div style="font-size: 20px">{{ type }}</div>

                      <div class="line1"></div>

                      <div class="huanhang">
                        <div class="biaoqian2" style="
                            background-color: rgb(0, 175, 155);
                            color: white;
                          ">
                          {{ catalogID }}
                        </div>
                        {{ questionDetail.tags }}
                        <!-- <div class="biaoqian2">最新</div> -->
                        <!-- <div class="biaoqian1" v-for="(item, index) in 3">
                          标签二
                        </div> -->
                      </div>
                    </div>
                  </div>

                  <div class="border_bottom background1" style="padding: 20px">
                    <!-- <div v-html="htmll"></div> -->
                  </div>
                  <div class="border_bottom background1 colonn" style="padding: 20px; align-items: flex-start">
                    <div>
                      <!-- 在关系代数中，对一个关系做投影操作后，新关系的元组个数（
                      ）原来关系的元组个数。 -->
                      {{ questionDetail.question }}
                    </div>
                    <div class="colonn">
                      <div style="margin-top: 20px">A：小于</div>
                      <div style="margin-top: 20px">B：小于</div>
                      <div style="margin-top: 20px">C：小于</div>
                      <div style="margin-top: 20px">D：小于</div>
                    </div>
                  </div>

                  <div class="colonn background1" style="padding: 0px 20px 20px 20px; align-items: flex-start">
                    <div style="font-weight: bold; padding: 20px 0px 20px 0px">
                      解析
                    </div>
                    <div style="
                        background-color: #000000;
                        color: #08979c;
                        padding: 20px;
                      ">
                      {{ questionDetail.answer }}
                    </div>
                  </div>

                  <!-- <div class="roww background1 " style="padding:20px;">
										<el-button type="primary">文字解析</el-button>
									</div> -->

                  <div class="roww background1 center_center" style="
                      padding: 10px 20px 10px 20px;
                      color: #999999;
                      border-top: 1px solid #f5f5f5;
                    ">
                    <div class="roww center_center">
                      <el-button style="color: #999999" class="el-icon-s-goods" type="text">收藏
                      </el-button>
                    </div>
                    <div class="line2"></div>
                    <div class="roww center_center">
                      <el-button style="color: #999999" class="el-icon-s-goods" type="text" @click="like">点赞
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <div class="grid-content colonn">
              <el-card style="margin-bottom: 10px">
                <div class="colonn border_bottom background1" style="margin-bottom: 30px">
                  <div class="border_bottom" style="padding: 20px">
                    題目信息
                  </div>
                  <div class="roww" style="padding: 20px 20px 20px 20px">
                    <div>浏览数：1534</div>
                  </div>
                  <div class="roww" style="padding: 0px 20px 20px 20px">
                    <div>发布时间：2022-01-04 10:22</div>
                  </div>

                  <div class="roww center_center" style="padding: 0px 20px 20px 20px">
                    <div>上传者：</div>
                    <div class="roww center_center">
                      <el-icon>
                        <Avatar />
                      </el-icon>
                      <!-- <img src="../assets/tkdog.png"
												style="width:30px;height:30px;border-radius: 50%;margin-right:15px;" /> -->
                      <el-tooltip style="background-color: #ffffff" effect="light" content="Top Center 提示文字"
                        placement="bottom">
                        <template #content>
                          <userInfo></userInfo>
                        </template>
                        <div>活宝</div>
                      </el-tooltip>

                      <div class="lveeltag">V2</div>
                      <div class="guanliyuan" style="width: 50px">管理员</div>
                      <div class="allline"></div>
                    </div>
                    <div class="allline"></div>
                  </div>

                  <div class="roww center_center" style="padding: 0px 20px 20px 20px">
                    <div>点赞人数：20</div>
                    <div class="allline"></div>
                  </div>
                </div>
              </el-card>

              <el-card style="margin-bottom: 10px">
                <div class="colonn border_bottom background1">
                  <div class="border_bottom" style="padding: 20px">
                    相似题目
                  </div>
                  <paper_tem v-for="(item, index) in 3" :key="3"></paper_tem>
                </div>
              </el-card>

              <el-card>
                <div class="colonn background1" style="padding: 20px; margin-top: 20px">
                  <div class="roww" style="margin-bottom: 10px">
                    <img src="../assets/dog.png" style="width: 80px; height: 80px; margin-right: 15px" />
                    <div class="colonn" style="text-align: left">
                      <div style="text-align: left; font-weight: bold">
                        编程导航
                      </div>
                      <div class="txtShowLength1" style="
                          text-align: left;
                          color: #99a9bf;
                          margin-top: 15px;
                        ">
                        专业全面的编程资源站点，不再求人！专业全面的编程资源站点，不再求人！专业全面的编程资源站点，不再求人！专业全面的编程资源站点，不再求人！
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <shitilan></shitilan>
  </div>
</template>

<script setup lang="ts">
import paper_tem from '@/components/me/paper_tem.vue';
import userInfo from '@/components/Home/userInfo.vue';
import shitilan from '@/components/shitilan.vue';
import { getQuestionDetail, likeQuestion } from '@/services';
import { ref, computed } from 'vue';
import { questionType, difficulty, catalogIDType } from '@/utils';
import type { IQuestion } from '@/types';
import queryString from 'query-string';

const questionDetail = ref({} as IQuestion);

const getDailyQuestion = async () => {
  const { id } = queryString.parse(window?.location?.href?.split('?')[1] || '');
  const res = await getQuestionDetail({ id } as any);
  questionDetail.value = res;
};
const type = computed(() => {
  return questionType(Number(questionDetail.value.questionType));
});
const degreeDifficulty = computed(() => {
  return difficulty(Number(questionDetail.value.difficulty));
});
const catalogID = computed(() => {
  return catalogIDType(Number(questionDetail.value.catalogID));
});

const like = async () => {
  await likeQuestion({
    id: questionDetail.value.id,
    creator: questionDetail.value.creator,
  } as any);
};

getDailyQuestion();
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  background-color: rgba(240, 242, 245, 1);
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
  margin-bottom: 15px;
  margin-bottom: 0px;
}

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

.line2 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 0px;
}

.jiandaee {
  color: rgba(170, 170, 170, 1);
  font-size: 13px;
  margin-left: 20px;
}

.nums {
  color: #999999;
  font-size: 15px;
  margin-left: 5px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid rgba(240, 242, 245, 1);
}

.lveeltag {
  width: 40px;
  height: 20px;
  color: #08979c;
  background: #e6fffb;
  border: #87e8de 1px solid;
  border-radius: 2px;
  margin-left: 15px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}

.guanliyuan {
  width: 70px;
  height: 20px;
  border: #ffa39e 1px solid;
  border-radius: 2px;
  margin-left: 15px;
  background-color: #fff1f0;
  font-size: 12px;
  color: #ffa39e;
  text-align: center;
  line-height: 20px;
}

.bens {
  width: 60px;
  height: 30px;
  background-color: #1890ff;
  border-radius: 3px;

  color: white;
  text-align: center;
  line-height: 30px;
}

.nums {
  color: #999999;
  font-size: 15px;
  margin-left: 5px;
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
  margin-bottom: 0px;
}

/* .line1 {
	width: 1px;
	height: 15px;
	background-color: #e6e6e6;
	margin: 0px 20px;

} */

.taolunqua {
  width: 100%;
  /* margin: 0px 20px 20px 20px; */
  flex-shrink: 0;
  /*防止被压缩*/
  overflow-y: scroll;
  white-space: nowrap;
  max-height: 300px;
}
</style>
