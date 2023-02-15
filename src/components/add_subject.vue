<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="16">
            <el-card style="margin-right: 10px">
              <div style="padding: 20px 20px 20px 20px">
                <div class="background1 colonn" style="padding: 30px 0px 30px 0px">
                  <div class="roww border_bottom center_center" style="padding: 0px 20px 20px 20px">
                    <div>上传题目</div>
                    <div class="allline"></div>
                    <div class="roww">
                      <div>欢迎分享面试题，</div>
                      <div style="color: #1890ff">获取积分</div>
                    </div>
                  </div>

                  <el-form ref="form" :model="contentFormState" label-width="100px" label-position="left"
                    hide-required-asterisk style="padding: 0px 30px 30px 30px; margin-top: 20px" class="demo-ruleForm"
                    required="true">
                    <el-form-item label="">
                      <label><span style="color: red">*</span> 科目</label>
                      <el-radio-group v-model="contentFormState.subjectID">
                        <el-radio v-for="item in subject" :key="item.subjectID" :label="item.title"
                          :name="item.subjectID"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="name">
                      <label><span style="color: red">*</span> 题型</label>
                      <el-radio-group v-model="contentFormState.questionType">
                        <el-radio v-for="item in data" :key="item.questionType" :label="item.title"
                          :name="item.questionType"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                      <label><span style="color: red">*</span> 难度</label>
                      <el-radio-group v-model="contentFormState.difficulty">
                        <el-radio v-for="item in diff" :key="item.difficulty" :label="item.title"
                          :name="item.difficulty"></el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item required="true" prop="name" label="标签">
                      <label><span style="color: red">*</span> 标签</label>
                      <el-select multiple style="width: 100%" v-model="contentFormState.tags"
                        placeholder="可选至多五个标签,支持搜索">
                        <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                          <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </el-form-item>

                    <el-form-item>
                      <label><span style="color: red">*</span> 题目</label>
                      <!-- <mavon-editor v-model="value" /> -->
                      <el-input v-model="contentFormState.question" :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea" placeholder="请输入正确的题目格式" />
                    </el-form-item>
                    <el-form-item label="">
                      <label><span style="color: red">*</span> 参考题解</label>
                      <!-- <mavon-editor v-model="value" /> -->
                      <el-input v-model="contentFormState.answer" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                        placeholder="请输入正确的题解格式" />
                    </el-form-item>

                    <el-form-item label="标题备注">
                      <label><span style="color: white">*</span> 标题备注</label>
                      <el-input v-model="contentFormState.remarks" placeholder="建议用题目考察要点命名，可不填"></el-input>
                    </el-form-item>

                    <el-form-item>
                      <!-- @click="onSubmit" -->
                      <el-button type="primary" @click="confirmContent()" :disabled="
                        contentFormState.isChoice == 0 ? true : false
                      ">提 交</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <div class="bg-purple-light" style="padding: 20px">
                <div class="colonn border_bottom background1">
                  <div class="border_bottom" style="padding: 20px">
                    相似题目（请勿重复上传）
                  </div>

                  <paper_tem v-for="(item, index) in 3" :key="index + 'a'"></paper_tem>

                  <div class="colonn border_bottom">
                    <div style="
                        font-weight: bold;
                        margin: 15px 0px;
                        padding: 0px 20px 0px 20px;
                      ">
                      2023腾讯春招面试题
                    </div>

                    <div class="huanhang" style="padding: 0px 20px 10px 20px">
                      <div class="biaoqian1" v-for="(item, index) in 3">
                        标签二
                      </div>
                    </div>

                    <div class="roww center_center jiandaee" style="
                        line-height: 20px;
                        height: 20px;
                        padding: 0px 20px 0px 0px;
                        margin-top: 0px;
                        margin-bottom: 0px;
                      ">
                      <div>2020-08-08</div>
                      <div class="line1"></div>
                      <div class="el-icon-scissors">困难</div>
                      <div class="allline"></div>
                    </div>
                  </div>
                  <div class="roww endend" style="padding: 10px 20px">
                    <div class="" style="flex-shrink: 0; /*防止被压缩*/">
                      总数650
                    </div>
                    <el-pagination background layout="prev, pager, next" :total="5">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <shitilan></shitilan>
  </div>
</template>

<script setup lang="ts">
import shitilan from '@/components/shitilan.vue';
import paper_tem from '@/components/me/paper_tem.vue';
import { ref, reactive } from 'vue';
import { takeQuestion } from '@/services';

const subject = [
  {
    title: 'javaScript',
    name: 'first',
    content: 'javaScript',
    subjectID: 0,
  },
  {
    title: 'CSS',
    name: 'second',
    content: 'CSS',
    subjectID: 1,
  },
  {
    title: 'HTML',
    name: 'third',
    content: 'HTML',
    subjectID: 2,
  },
  {
    title: 'ES6',
    name: 'fourth',
    content: 'ES6',
    subjectID: 3,
  },
  {
    title: 'React',
    name: 'fifth',
    content: 'React',
    subjectID: 4,
  },
  {
    title: 'Vue',
    name: 'sixth',
    content: 'Vue',
    subjectID: 5,
  },
  {
    title: 'Node',
    name: 'seventh',
    content: 'Node',
    subjectID: 6,
  },
  {
    title: 'webpack',
    name: 'eighth',
    content: 'webpack',
    subjectID: 7,
  },
  {
    title: 'TypeScript',
    name: 'ninth',
    content: 'TypeScript',
    subjectID: 8,
  },
  {
    title: '编程题',
    name: 'tenth',
    content: '编程题',
    subjectID: 9,
  },
  {
    title: '计算机基础',
    name: 'eleventh',
    content: '计算机基础',
    subjectID: 10,
  },
  {
    title: '计算机网络',
    name: 'twelfth',
    content: '计算机网络',
    subjectID: 11,
  },
];
const data = [
  {
    title: '单选题',
    name: 'first',
    content: '单选题',
    questionType: 0,
  },
  {
    title: '多选题',
    name: 'second',
    content: '多选题',
    questionType: 1,
  },
  {
    title: '判断题',
    name: 'third',
    content: '判断题',
    questionType: 2,
  },
  {
    title: '填空题',
    name: 'fourth',
    content: '填空题',
    questionType: 3,
  },
  {
    title: '简答题',
    name: 'fifth',
    content: '简答题',
    questionType: 4,
  },
];
const diff = [
  {
    title: '简单',
    name: 'first',
    content: '简单',
    difficulty: 0,
  },
  {
    title: '中等',
    name: 'second',
    content: '中等',
    difficulty: 1,
  },
  {
    title: '困难',
    name: 'third',
    content: '困难',
    difficulty: 2,
  },
];

let contentFormState = ref({
  subjectID: 0,
  catalogID: 0,
  difficulty: 0,
  questionType: 0,
  tags: [],
  question: '',
  answer: '',
  remarks: '',
  creator: 'admin',
  direction: '',

  // isChoice: 1, // 确认按钮的属性
});

const value = ref('');
// 多标签选择
const options = reactive([
  {
    label: '热门城市',
    options: [
      {
        value: 'Shanghai',
        label: '上海',
      },
      {
        value: 'Beijing',
        label: '北京',
      },
    ],
  },
  {
    label: '城市名',
    options: [
      {
        value: 'Chengdu',
        label: '成都',
      },
      {
        value: 'Shenzhen',
        label: '深圳',
      },
      {
        value: 'Guangzhou',
        label: '广州',
      },
      {
        value: 'Dalian',
        label: '大连',
      },
    ],
  },
]);

const confirmContent = () => {
  console.log(contentFormState.value); // 在控制台打印表单的数据
  // message.success("内容保存成功",5) // 文字弹窗提示
  //题目列表
  contentFormState.value.tags.join(',');
  takeQuestion(contentFormState.value).then((res) => {
    console.log(res);
  });
};
</script>

<style>
body {
  background-color: rgba(240, 242, 245, 1);
  margin: 0;
  padding: 0;
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

/* .line2 {
	width: 1px;
	height: 15px;
	background-color: #e6e6e6;
	margin: 0px 0px;
} */

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

.bens {
  width: 60px;
  height: 30px;
  background-color: #1890ff;
  border-radius: 3px;

  color: white;
  text-align: center;
  line-height: 30px;
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

.line1 {
  width: 1px;
  height: 15px;
  background-color: #e6e6e6;
  margin: 0px 20px;
}

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
