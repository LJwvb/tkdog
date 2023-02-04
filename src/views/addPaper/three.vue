<template>
  <div class="hello">
    
    
    <el-row>
    	
    	<el-col :span="6" style="margin:30px 0px;">
    		<div class="grid-content ">
    			<el-table
    			   :data="tableData"
    			   style="width: 100%">
    			   <el-table-column type="expand">
    			     <template #default="props">
    			    				<div style="padding:20px;">
    			    					<el-table 
    			    					      :data="tableData1"
    			    					      style="width: 100%"
    			    						  row-key="id"
    			    						  >
    			    					      <el-table-column
    			    					        prop="date"
    			    					        label="标题"
    			    					        width="80px">
    			    							<template  #default="scope">
    			    								<div class="txtShowLength1">{{scope.row.date}}</div>
    			    							</template>
    			    					      </el-table-column>
    			    					      <el-table-column
    			    					        prop="name"
    			    					        label="简单"
    			    					        width="100px">
    			    							<template  #default="scope">
    			    								 <el-tag type="success">简单</el-tag>
    			    							</template>
    			    					      </el-table-column>
    			    					      <el-table-column
    			    					        prop="address"
    			    					        label="操作"
    			    					        width="100px">
    			    							<el-button type="danger">移出</el-button>
    			    					      </el-table-column>
    			    					    </el-table>
    			    				</div>
    			     </template>
    			   </el-table-column>
    			   <el-table-column
    			     label="题型"
    			     prop="id">
    			   </el-table-column>
    			   <el-table-column
    			     label="数量"
    			     prop="name">
    			   </el-table-column>
    			 </el-table>
    		</div>
    	</el-col>
		<el-col :span="18">
			<el-card class="box-card" style="    margin: 30px 30px 30px 10px;
    margin-left: 10px;">

			<div class="grid-content background1"
			style="margin:30px 0px 30px 30px;"
			>
					<div class="colonn">
						
						<div class="rowsb border_bottom center_center" style="padding:20px;">
							<div style="font-size: 20px;font-weight: bold;">百度2018校园招聘-机器学习</div>
							<el-button>操作</el-button>
						</div>
						<div class="border_bottom" v-for="(item,index) in 10" style="padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;">
							<div>百度2018校园招聘-机器学习</div>
							<div style="font-weight: bold;margin:15px 0px;">1.单选题</div>
							<div style="font-weight: bold;margin:15px 0px;">以下不是SVM核函数的是</div>
							<div style="margin-top:40px;">A：Sigmoid核函数</div>
							<div style="margin-top:20px;">B：Sigmoid核函数</div>
							<div style="margin-top:20px;">C：Sigmoid核函数</div>
							<div style="margin-top:20px;">D：Sigmoid核函数</div>
							<div style="margin-top:20px;">解析：C</div>
						</div>
				
					</div>
					
			</div>
		</el-card>
		</el-col>
    </el-row>
    
  </div>
</template>


	<script setup lang="ts">
		import shiquans from "@/components/shiquans.vue";
import { ref,reactive } from 'vue'
const tableData1=reactive(
	[{
								 id:1,
			           date: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
			           name: '王小虎',
			           address: '上海市普陀区金沙江路 1518 弄'
			         }, {
								 id:2,
			           date: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
			           name: '王小虎',
			           address: '上海市普陀区金沙江路 1517 弄'
			         }, {
								 id:3,
			           date: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
			           name: '王小虎',
			           address: '上海市普陀区金沙江路 1519 弄'
			         }, {
								 id:4,
			           date: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
			           name: '王小虎',
			           address: '上海市普陀区金沙江路 1516 弄'
			         }]
)

const tableData =reactive(
	[{
			         id: '12987122',
			         name: '好滋好味鸡蛋仔',
			         category: '江浙小吃、小吃零食',
			         desc: '荷兰优质淡奶，奶香浓而不腻',
			         address: '上海市普陀区真北路',
			         shop: '王小虎夫妻店',
			         shopId: '10333'
			       }, {
			         id: '12987123',
			         name: '好滋好味鸡蛋仔',
			         category: '江浙小吃、小吃零食',
			         desc: '荷兰优质淡奶，奶香浓而不腻',
			         address: '上海市普陀区真北路',
			         shop: '王小虎夫妻店',
			         shopId: '10333'
			       }, {
			         id: '12987125',
			         name: '好滋好味鸡蛋仔',
			         category: '江浙小吃、小吃零食',
			         desc: '荷兰优质淡奶，奶香浓而不腻',
			         address: '上海市普陀区真北路',
			         shop: '王小虎夫妻店',
			         shopId: '10333'
			       }, {
			         id: '12987126',
			         name: '好滋好味鸡蛋仔',
			         category: '江浙小吃、小吃零食',
			         desc: '荷兰优质淡奶，奶香浓而不腻',
			         address: '上海市普陀区真北路',
			         shop: '王小虎夫妻店',
			         shopId: '10333'
			       }]
)

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.txtShowLength1 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>