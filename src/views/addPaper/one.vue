<template>
  <div class="hello">
    <div class="colonn">
    	
    	<div class="colonn background1" style="margin-top:20px;padding-top:30px;">
    		<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
    			<el-form-item label="活动名称" prop="name" style="padding-right:40px;">
    				<el-input v-model="name" placeholder="如:腾讯前端一面"></el-input>
    			</el-form-item>
    			<el-form-item label="描述" prop="name" style="padding-right:40px;">
    				<el-input v-model="name" type="textarea" placeholder="请对试卷进行简单描述"></el-input>
    			</el-form-item>
    			<el-form-item label="标签" prop="name" style="padding-right:40px;">
    				<el-input v-model="name"></el-input>
    			</el-form-item>
    			<el-form-item label="权限" prop="name">
    			     <el-radio-group v-model="name">
    			          <el-radio label="私有"></el-radio>
    			          <el-radio label="公开"></el-radio>
    			        </el-radio-group>
    			  </el-form-item>
    		</el-form>
    	</div>
    	
    </div>
  </div>
</template>

<script setup lang="ts">
import{ref }from "vue"
const name=ref('')


		const onChange=(index:number)=> { // 父组件获取切换后的选中步骤
			console.log('parentIndex:', index)
		}
	
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>