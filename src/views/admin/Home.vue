<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse': collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue';
import bus from '@/bus';
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
    vSidebar
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })

  }
}
</script>

