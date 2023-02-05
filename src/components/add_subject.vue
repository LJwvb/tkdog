<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="16">
            <el-card style="margin-right: 10px">
              <div style="padding: 20px 20px 20px 20px">
                <div
                  class="background1 colonn"
                  style="padding: 30px 0px 30px 0px"
                >
                  <div
                    class="roww border_bottom center_center"
                    style="padding: 0px 20px 20px 20px"
                  >
                    <div>上传题目</div>
                    <div class="allline"></div>
                    <div class="roww">
                      <div>欢迎分享面试题，</div>
                      <div style="color: #1890ff">获取积分</div>
                    </div>
                  </div>

                  <el-form
                    :rules="rules"
                    ref="form"
                    :model="form"
                    label-width="100px"
                    label-position="left"
                    hide-required-asterisk
                    style="padding: 0px 30px 30px 30px; margin-top: 20px"
                    class="demo-ruleForm"
                    required="true"
                  >
                    <el-form-item prop="name">
                      <label slot="label"
                        ><span style="color: red">*</span> 题型</label
                      >
                      <el-radio-group v-model="form.resource">
                        <el-radio label="简答"></el-radio>
                        <el-radio label="单选"></el-radio>
                        <el-radio label="不定向"></el-radio>
                        <el-radio label="填空"></el-radio>
                        <el-radio label="编程"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="">
                      <label slot="label"
                        ><span style="color: red">*</span> 难度</label
                      >
                      <el-radio-group v-model="form.resource">
                        <el-radio label="简单"></el-radio>
                        <el-radio label="中等"></el-radio>
                        <el-radio label="困难"></el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item required="true" prop="name" label="标签">
                      <label slot="label"
                        ><span style="color: red">*</span> 标签</label
                      >
                      <el-select
                        multiple
                        style="width: 100%"
                        v-model="value"
                        placeholder="可选至多五个标签,支持搜索"
                      >
                        <el-option-group
                          v-for="group in options"
                          :key="group.label"
                          :label="group.label"
                        >
                          <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </el-form-item>

                    <el-form-item>
                      <label slot="label"
                        ><span style="color: red">*</span> 题目</label
                      >
                      <!-- <mavon-editor v-model="value" /> -->
                      <el-input
                        v-model="textarea1"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea"
                        placeholder="请输入正确的题目格式"
                      />
                    </el-form-item>
                    <el-form-item label="">
                      <label slot="label"
                        ><span style="color: red">*</span> 参考题解</label
                      >
                      <!-- <mavon-editor v-model="value" /> -->
                      <el-input
                        v-model="textarea2"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea"
                        placeholder="请输入正确的题解格式"
                      />
                    </el-form-item>

                    <el-form-item label="视频题解">
                      <label slot="label"
                        ><span style="color: white">*</span> 视频题解</label
                      >
                      <el-input
                        v-model="form.name"
                        placeholder="请输入 B 站视频嵌入链接（https://player.bilibili.com 开头)，可不填"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="标题备注">
                      <label slot="label"
                        ><span style="color: white">*</span> 标题备注</label
                      >
                      <el-input
                        v-model="form.name"
                        placeholder="建议用题目考察要点命名，可不填"
                      ></el-input>
                    </el-form-item>

                    <el-form-item>
                      <!-- @click="onSubmit" -->
                      <el-button type="primary">提 交</el-button>
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

                  <paper_tem
                    v-for="(item, index) in 3"
                    :key="index + 'a'"
                  ></paper_tem>

                  <div class="colonn border_bottom">
                    <div
                      style="
                        font-weight: bold;
                        margin: 15px 0px;
                        padding: 0px 20px 0px 20px;
                      "
                    >
                      2023腾讯春招面试题
                    </div>

                    <div class="huanhang" style="padding: 0px 20px 10px 20px">
                      <div class="biaoqian1" v-for="(item, index) in 3">
                        标签二
                      </div>
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
                      <div class="el-icon-scissors">困难</div>
                      <div class="allline"></div>
                    </div>
                  </div>
                  <div class="roww endend" style="padding: 10px 20px">
                    <div class="" style="flex-shrink: 0; /*防止被压缩*/">
                      总数650
                    </div>
                    <el-pagination
                      background
                      layout="prev, pager, next"
                      :total="5"
                    >
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
const textarea1 = ref('');
const textarea2 = ref('');
const name = ref('me_compon');

let form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const rules = reactive({
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  date1: [
    { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
  ],
  date2: [
    { type: 'date', required: true, message: '请选择时间', trigger: 'change' },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个活动性质',
      trigger: 'change',
    },
  ],
  resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
  desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
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
</script>

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
