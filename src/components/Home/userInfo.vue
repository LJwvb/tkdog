<template>
	<div>
		<div class="alertview1 colonn">
			<div class="roww border_bottom" style="padding-bottom:25px;">
				<img src="../../assets/dog1.jpg"
					style="width:100px;height:100px;border-radius: 50%;margin-right:15px;" />
				<div class="colonn">
					<div class="roww center_center">
						<div style="color: #000000;font-size: 25px;">活宝</div>
						<div class="lveeltag1">V2</div>
						<div class="guanliyuan1">管理员</div>
						<div class="allline"></div>
					</div>
					<div class="roww" style="margin-top:7px;">
						<div style="color: #99a9bf;line-height: 25px;height: 25px;">暂无个人简介</div>
					</div>
					<div class="roww center_center" style="margin-top:7px;border-radius: 3px;border:1px solid #999999;width:60px;">
						<img  src="/static/chuizi.png" style="width:20px;height:10px;"/>
					</div>
					
				</div>
			</div>
			<div style="width:100%;height: 1px;background-color: #f5f5f5;"></div>
			<div style="height:15px;"></div>
			<div class="colonn" style="font-size: 20px;">
				<el-row>
				  <el-col :span="12"><div class="colheng">积分：55</div></el-col>
				  <el-col :span="12"><div  class="colheng">性别：男</div></el-col>
				</el-row>
				<el-row>
				  <el-col :span="12"><div  class="colheng">兴趣：羽毛球</div></el-col>
				  <el-col :span="12"><div  class="colheng"></div></el-col>
				</el-row>
				<el-row>
				  <el-col :span="12"><div class="colheng">状态：暂无</div></el-col>
				  <el-col :span="12"><div  class="colheng"></div></el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	
		// props: {
		// 	content: "", //接收参数
		// },

</script>
<style >
	.colheng{
		padding:10px 0px;
	}
	div{
		color: #000000;
	}
	.alertview1 {
		/* width: 400px;
		height: 250px; */
		background-color: #ffffff;
		padding:20px;
	}

	.lveeltag1 {
		width: 60px;
		height: 30px;
		color: #08979c;
		background: #e6fffb;
		border: #87e8de 1px solid;
		border-radius: 2px;
		margin-left: 15px;
		line-height: 30px;
		font-size: 20px;
		text-align: center;
	}

	.guanliyuan1 {
		width: 90px;
		height: 30px;
		border: #ffa39e 1px solid;
		border-radius: 2px;
		margin-left: 15px;
		background-color: #fff1f0;
		font-size: 20px;
		color: #ffa39e;
		text-align: center;
		line-height: 30px;
	}
	
	.grid-content {
		border-radius: 4px;
		min-height: 36px;
		border: 1px solid #ffffff;
	}
	.bg-purple-dark {
		background: #ffffff;
	}
</style>
