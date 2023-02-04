<template>
  <div class="hello">
	<div class="grid-content  bg-purple-light"
	>
		<div class="colonn ">
			<div class="colonn background1" style="padding:30px 20px;">
				<div style="font-weight: bold;font-size: 20px;">标签大全</div>
				<el-row style="margin-top:15px;">
					<el-col :span="5">
						<div class="grid-content bg-purple">
							<el-input placeholder="请输入标签" v-model="input3">
								<el-button slot="append" type="primary"
									style="background:#409eff;color:white;" icon="el-icon-search">
								</el-button>
							</el-input>
						</div>
					</el-col>
					<el-col :span="16">
						<div class="grid-content bg-purple" style="color: #ffffff;">1</div>
					</el-col>
					<el-col :span="3">
						<div class="grid-content bg-purple-light roww endend">
							<el-button style="border-radius: 2px;" type="primary">我关注的</el-button>
						</div>
					</el-col>
				</el-row>
			</div>
			
			<div class="huanhang " style="margin-top:25px;">
				<div style="width: 23%;height: 200px;margin:1%;" 
				class="background1 colonn center_center"
				v-for="(item,index) in 50"
				>
					<img src="../../assets/tkdog.png" class="logo1" />
					<div style="font-size: 15px;font-weight: bold;margin-top:15px;margin-bottom:20px;">subject_bytype</div>
					 <div class="roww center_center">
						 <el-button type="primary" >已关注</el-button>
					 </div>
				</div>
			</div>
		</div>
	</div>
  </div>
</template>
<script setup lang="ts">
const name = ref("me_compon")

</script>
<!-- <script >
export default {
  name: 'me_compon',
  data () {
    return {
      isCollapse:false,
	  input3:"",
    }
  },
  methods:{
	  handleClose(){},
  }
}
</script> -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.el-main {
		padding: 0px;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		height: 100%;
	}
	.logo1{
		width:60px;
		height: 60px;
	}
</style>