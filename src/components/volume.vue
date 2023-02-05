<template>
  <div class="hello">
    <!-- 试卷详情 -->
    <el-container>
      <el-main style="padding: 30px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card>
              <div class="background1">
                <div class="colonn">
                  <div
                    class="rowsb border_bottom center_center"
                    style="padding: 20px"
                  >
                    <div style="font-size: 20px; font-weight: bold">
                      百度2018校园招聘-机器学习
                    </div>
                    <el-button>隐藏解析</el-button>
                  </div>

                  <div id="shijuan">
                    <div
                      class="border_bottom"
                      v-for="(item, index) in 10"
                      style="
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                      "
                    >
                      <div>百度2018校园招聘-机器学习</div>
                      <div style="font-weight: bold; margin: 15px 0px">
                        1.单选题
                      </div>
                      <div style="font-weight: bold; margin: 15px 0px">
                        以下不是SVM核函数的是
                      </div>
                      <div style="margin-top: 40px">A：Sigmoid核函数</div>
                      <div style="margin-top: 20px">B：Sigmoid核函数</div>
                      <div style="margin-top: 20px">C：Sigmoid核函数</div>
                      <div style="margin-top: 20px">D：Sigmoid核函数</div>
                      <div style="margin-top: 20px">解析：C</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <div class="grid-content colonn">
              <el-card style="margin-bottom: 10px">
                <div
                  class="colonn border_bottom background1"
                  style="margin-bottom: 30px"
                >
                  <div class="border_bottom" style="padding: 20px">
                    试卷信息
                  </div>
                  <div class="roww" style="padding: 20px">
                    <div>浏览数：1534</div>
                  </div>
                  <div class="roww" style="padding: 0px 20px 0px 20px">
                    <div style="width: 100px">标签：</div>
                    <div class="huanhang">
                      <div class="biaoqian1" v-for="(item, index) in 8">
                        标签二
                      </div>
                    </div>
                  </div>
                  <div class="roww" style="padding: 0px 20px 20px 20px">
                    <div>发布时间：2022-01-04 10:22</div>
                  </div>

                  <div
                    class="roww center_center"
                    style="padding: 0px 20px 20px 20px"
                  >
                    <div>上传者：</div>
                    <div class="roww center_center">
                      <!-- <el-icon>
												<Avatar />
											</el-icon> -->
                      <img
                        src="../assets/dog1.jpg"
                        style="
                          width: 30px;
                          height: 30px;
                          border-radius: 50%;
                          margin-right: 15px;
                        "
                      />
                      <el-tooltip
                        style="background-color: #ffffff"
                        effect="light"
                        content="Top Center 提示文字"
                        placement="bottom"
                      >
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
                </div>
              </el-card>

              <el-card style="margin-bottom: 10px">
                <div class="colonn border_bottom background1">
                  <div class="border_bottom" style="padding: 20px">
                    相似试卷
                  </div>
                  <!-- <paper_tem v-for="(item, index) in 3" :key="3"></paper_tem> -->
                  <div class="colonn border_bottom" v-for="(item, index) in 10">
                    <div
                      style="
                        display: flex;
                        font-weight: bold;
                        margin: 15px 0px;
                        padding: 0px 20px 0px 20px;
                      "
                    >
                      2023腾讯春招面试题
                    </div>
                    <div
                      class="roww center_center jiandaee"
                      style="
                        line-height: 20px;
                        height: 20px;
                        padding: 0px 20px 0px 0px;
                        margin-top: 0px;
                        margin-bottom: 0px;
                      "
                    >
                      <div>2020-08-08</div>
                      <div class="line1"></div>
                      <div>困难</div>
                      <div class="allline"></div>
                    </div>

                    <div class="huanhang" style="padding: 20px 20px 0px 20px">
                      <div class="biaoqian1" v-for="(item, index) in 3">
                        标签二
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>

              <el-card>
                <div
                  class="colonn background1"
                  style="padding: 20px; margin-top: 20px"
                >
                  <div class="roww" style="margin-bottom: 10px">
                    <img
                      src="../assets/dog1.jpg"
                      style="width: 80px; height: 80px; margin-right: 15px"
                    />
                    <div class="colonn" style="text-align: left">
                      <div style="text-align: left; font-weight: bold">
                        编程导航
                      </div>
                      <div
                        class="txtShowLength1"
                        style="
                          text-align: left;
                          color: #99a9bf;
                          margin-top: 15px;
                        "
                      >
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
</script>

<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  border: 1px solid #ffffff;
}
</style>
