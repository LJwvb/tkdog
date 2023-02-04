<template>
	<div class="hello">
		<el-card class="box-card" style="margin:20px 20px 20px 0;">

			<div class="colonn background1">
				<div class="rowsb padding23 border_bottom center_center">
					<div>上传记录（10）</div>
				</div>
				<div class="roww padding23" style="margin-top: 30px;">

					<el-dropdown split-button style="margin-right:15px;">
						题目状态
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item>审核中</el-dropdown-item>
								<el-dropdown-item>已发布</el-dropdown-item>
								<el-dropdown-item>已拒绝</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<el-dropdown split-button style="margin-right:15px;">
						题型
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item>简答</el-dropdown-item>
								<el-dropdown-item>单选</el-dropdown-item>
								<el-dropdown-item>不定向</el-dropdown-item>
								<el-dropdown-item>填空</el-dropdown-item>
								<el-dropdown-item>编程</el-dropdown-item>
							</el-dropdown-menu>
						</template>

					</el-dropdown>

					<el-dropdown split-button style="margin-right:15px;">
						难度
						<template #dropdown>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item>简单</el-dropdown-item>
								<el-dropdown-item>中等</el-dropdown-item>
								<el-dropdown-item>困难</el-dropdown-item>
							</el-dropdown-menu>
						</template>

					</el-dropdown>

				</div>
				<div class="colonn">
					<subject_item style="margin-top:20px;" v-for="(item, index) in 3" :key="index"></subject_item>
					<div class="roww endend" style="padding:10px 20px;">
						<div>总数650</div>
						<el-pagination background layout="prev, pager, next" :total="1000">
						</el-pagination>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">

import subject_item from "@/components/me/subject_item.vue"
import {ref} from 'vue'
const name=ref('me_compon')
	const input=ref('')

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>