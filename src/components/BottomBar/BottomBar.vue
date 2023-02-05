<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <div class="grid-content">
        <div class="connection">
          <el-icon>
            <Avatar />
          </el-icon>
          <span>杨绵绵</span>
          <el-icon>
            <Promotion />
          </el-icon>
          <span>21计算机3班</span>
        </div>
        <el-icon>
          <LocationInformation />
        </el-icon>
        <span>浙江外国语学院</span>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
