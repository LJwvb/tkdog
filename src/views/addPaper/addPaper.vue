<template>
  <div class="hello">
    <el-container>
      <el-main style="padding: 30px">
        <div class="colonn">
          <div style="padding: 20px" class="background1">
            <el-steps
              :active="selIndex"
              align-center
              style="background-color: #ffffff"
            >
              <el-step title="试卷信息"></el-step>
              <el-step title="选择题目"></el-step>
              <el-step title="浏览试卷"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </div>
          <router-view></router-view>
          <div
            class="roww rowsb background1"
            style="
              justify-content: space-between;
              padding: 10px;
              margin: 0 20px 0 20px;
              background-color: white;
            "
          >
            <el-button type="primary" @click="xiayibuClick(2)"
              >上一步</el-button
            >
            <el-button type="primary" @click="xiayibuClick(1)"
              >下一步</el-button
            >
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
// import router from '../../router'
import { useRouter } from 'vue-router';
const router = useRouter();
router.push({
  path: '/addPaper/addPaperone',
});

const name = ref('');
const selIndex = ref(0);
const paths = ref([
  '/addPaper/addPaperone',
  '/addPaper/addPapertwo',
  '/addPaper/addPaperthree',
  '/addPaper/addPaperfour',
]);

const onChange = (index: string) => {
  // 父组件获取切换后的选中步骤
  console.log('parentIndex:', index);
};
const xiayibuClick = (type: number) => {
  if (type == 1) {
    // 加法
    if (selIndex.value <= 3) {
      selIndex.value = selIndex.value + 1;
      toPage();
    }
  } else if (type == 2) {
    if (selIndex.value > 0) {
      selIndex.value = selIndex.value - 1;
      toPage();
    }
  }
};
const toPage = () => {
  console.log(selIndex);
  router.push({
    path: paths.value[selIndex.value],
  });
};
// 	data () {
// 		return {
// 			name: "",
// 			selIndex: 0,
// 			paths: ['/addPaper/addPaperone', '/addPaper/addPapertwo', '/addPaper/addPaperthree', '/addPaper/addPaperfour']
// 		}
// 	},
// 	created () {
// 		this.$router.push({
// 			path: '/addPaper/addPaperone'
// 		})
// 	},
// 	methods: {
// 		onChange (index) { // 父组件获取切换后的选中步骤
// 			console.log('parentIndex:', index)
// 		},
// 		xiayibuClick (type) {
// 			if (type == 1) {
// 				// 加法
// 				if (this.selIndex <= 3) {
// 					this.selIndex = this.selIndex + 1
// 					this.toPage()
// 				}
// 			} else if (type == 2) {
// 				if (this.selIndex > 0) {
// 					this.selIndex = this.selIndex - 1
// 					this.toPage()
// 				}
// 			}
// 		},
// 		toPage () {
// 			console.log(this.selIndex)
// 			this.$router.push({
// 				path: this.paths[this.selIndex]
// 			})
// 		},
// 	}
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  background-color: rgba(240, 242, 245, 1);
}
</style>
