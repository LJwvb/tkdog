<template>
  <div >
    <div>
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
    					        width="450px">
    							<template  #default="scope">
    								<div class="txtShowLength1">{{scope.row.date}}</div>
    							</template>
    					      </el-table-column>
    					      <el-table-column
    					        prop="name"
    					        label="简单"
    					        width="100px">
    							<template>
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
  </div>
</template>

<script setup lang="ts">
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
<style >

</style>