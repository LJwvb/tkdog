<template>

	<div class="hello">
		<el-card class="box-card" style="margin:20px 20px 20px 0;">
			<div class="colonn background1">
				<div class="rowsb padding23 border_bottom center_center">
					<div>我的收藏（9）</div>
				</div>
				<div class="rowsb padding23 border_bottom center_center">
					<el-input v-model="input" placeholder="支持按照标签搜索"></el-input>

				</div>
				<div class="colonn">
					<wentiitem style="margin-top:20px;" v-for="(item, index) in 2" :key="index"></wentiitem>
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
import {ref} from 'vue'
import wentiitem from "@/components/Home/wentiitem.vue"
	const name=ref('me_compon')
	const input=ref('')
	
// me_collection.vue
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
h1,
h2 {
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