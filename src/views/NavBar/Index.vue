<template>
  <div class="nav-container">
    <Logo></Logo>
    <Menu></Menu>
    <Search></Search>
    <Avatar></Avatar>
  </div>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue';
import Logo from './Logo.vue';
import Menu from './Menu.vue';
import Search from './Search.vue';
</script>
<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 0 20px;
}
</style>
