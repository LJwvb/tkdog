<template>
	<div>
		<div class="colonn background1" style="padding:0px 20px;">
			<div class="title txtShowLength1" style="margin-bottom:20px;">
				期天上午小明乘出租车去本市的期天上午小明乘出租车去本市的期天上午小明乘出租车去本市的期天上午小明乘出租车去本市的期天上午小明乘出租车去本市的</div>

			<div></div>

			<div class="context txtShowLength1" style="margin-bottom:20px;">
				你的理想是什么呢？
			</div>

			<div class="huanhang">
				<div class="biaoqian2">最新</div>
				<div class="biaoqian1" v-for="(item, index) in 3">标签二</div>
			</div>
			<div class="huanhang" style="margin:15px 0 15px 0;">
				<div class="biaoqian3">审核中</div>
			</div>
			<div class="roww center_center jiandaee" style="    color: black;
    margin-bottom: 10px;">
				<div>简答题</div>
				<div class="line1"></div>
				<div>困难</div>
				<div class="line1"></div>
				<div>2020-08-08</div>
				<div class="allline"></div>
			</div>
			<div class="roww" style="padding-bottom:15px;border-bottom: #f5f5f5 solid 1px;margin-bottom: 10px;">
				<div class="roww center_center" style="margin-right:20px;">
					<img style="width:15px;height:15px;" />
					<div style="" class="nums">16472</div>
				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<img style="width:15px;height:15px;" />
					<div style="" class="nums">16472</div>
				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<img style="width:17px;height:17px;" />
					<div style="" class="nums">16472</div>
				</div>
				<div class="roww center_center" style="margin-right:20px;">
					<img style="width:17px;height:17px;" />
					<div style="" class="nums">16472</div>
				</div>

				<el-button type="text" class="el-icon-edit" style="margin-right:20px;">修改</el-button>

				<el-button type="text" class="el-icon-delete" style="margin-right:20px;color: red;">删除</el-button>

				<div class="allline"></div>
				<div>
					<div style="" class="bens">
						选题
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

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

.context {
	color: rgba(0, 0, 0, .85);
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

.biaoqian3 {
	padding: 0px 12px;
	font-size: 12px;
	height: 25px;
	line-height: 25px;
	border-radius: 2px;
	margin-right: 15px;
	color: #096dd9;
	background: #e6f7ff;
	border: 1px solid #096dd9;

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
}

.huanhang {
	display: flex;
	flex-wrap: wrap;
}
</style>
