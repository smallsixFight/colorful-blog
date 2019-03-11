<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse': collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './Header.vue';
  import bus from './bus';
  import vSidebar from './Sidebar.vue';

export default {
  name: 'home',
  data() {
    return {
      tagsList: [],
      collapse: false
    }
  },
  components: {
    vHead, 
    vSidebar, 
    // vTags
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })

  }
}
</script>
<style>
</style>

