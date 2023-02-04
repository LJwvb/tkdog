<template>
	<div>
		<div class="colonn background1"
		@click="toproblem_info">
			<div class="title txtShowLength1" style="margin-bottom:20px;">
				什么是事件？E与 Firefox的事件机制有什么区别？如何阻止冒泡？</div>
			<div class="tags" style="display: flex;padding-bottom: 20px;">
				<el-tag>Tag 1</el-tag>
				<el-tag class="ml-2" type="success">Tag 2</el-tag>
				<el-tag class="ml-2" type="info">Tag 3</el-tag>
				<el-tag class="ml-2" type="warning">Tag 4</el-tag>
				<el-tag class="ml-2" type="danger">Tag 5</el-tag>
			</div>

			<div class="roww center_center jiandaee" style="line-height: 50px;height: 50px;">
				<div>简答题</div>
				<div class="line1"></div>
				<div>困难</div>
				<div class="line1"></div>
				<div>2020-08-08</div>

			</div>
			<div class="roww" style="padding-bottom:15px;border-bottom: #f5f5f5 solid 1px;margin-bottom: 10px;">
				<div class="roww center_center" style="margin-right:20px;">
					<el-icon style="width:15px;height:15px;">
						<View />
					</el-icon>
					<div class="nums">16472</div>
				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<el-icon style="width:15px;height:15px;">
						<Star />
					</el-icon>
					<div class="nums">16472</div>
				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<el-icon style="width:15px;height:15px;">
						<ChatDotRound />
					</el-icon>
					<div class="nums">16472</div>

				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<el-icon style="width:15px;height:15px;">
						<Odometer />
					</el-icon>
					<div class="nums">16472</div>

				</div>

				<div style="" class="bens">
					选题

				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import router from '../../router'
const toproblem_info=()=> {
  router.push({
    path: '/problem_info',

  })
}


</script>
<style>
div {
	line-height: 20px;
}

.title {
	color: rgba(0, 0, 0, .85);
	font-weight: 600;
	font-size: 16px;
	line-height: 1.5;
	text-align: left;
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

}

.line1 {
	width: 1px;
	height: 15px;
	background-color: #e6e6e6;
	margin: 0px 20px;

}

.jiandaee {
	color: rgba(170, 170, 170, 1);
	font-size: 13px;
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
	font-size: 15px;
	margin-left: 735px;
}
</style>
