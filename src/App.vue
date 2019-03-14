<template>
  <div id="app" class="scrollbar">
    <router-view/>
  </div>
</template>
<style>
@import "./assets/css/admin/main.css";

.scrollbar {
  overflow-y:auto;
  overflow-x:hidden;
}
</style>