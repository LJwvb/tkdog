<template>

  <div id="nav">
    <!-- 固定导航栏 -->
    <el-affix target="#nav" :offset="0">
      <div style="background-color: #fff;">
        <el-row :gutter="30">
          <el-col :span="24">
            <NavBar></NavBar>

          </el-col>
        </el-row>
        <!-- <el-divider/> -->

      </div>

    </el-affix>


    <!-- <Home></Home> -->
    <el-row :gutter="30">
      <el-col class="grid-content bg-purple-light" :xs="24" :sm="24" :md="16" :lg="24" :xl="16" >
        <!-- 动态页面主体 -->
        <router-view/>
      </el-col>
      
    </el-row>

    <el-row :gutter="20" >
      <el-col :span="12" :offset="6">
        <div class="grid-content bg-purple-light">
          <BottomBar></BottomBar>
        </div>

      </el-col>
    </el-row>

    <el-backtop :right="100" :bottom="100" />

    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
  </div>

</template>
<script setup lang="ts">
import NavBar from './components/NavBar/NavBar.vue';
import SideBar from './components/SideBar/SideBar.vue';
import BottomBar from './components/BottomBar/BottomBar.vue';
import Home from './components/NavBar/Home.vue'
import Login from './views/login/Login.vue'

</script>
<style lang="scss">
body {
  overflow-x: hidden;
}

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


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  // padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
