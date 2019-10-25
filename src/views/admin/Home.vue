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
import vHead from "./Header.vue";
import bus from "@/bus";
import vSidebar from "./Sidebar.vue";

export default {
  name: "home",
  data() {
    return {
      collapse: false
    };
  },
  components: {
    vHead,
    vSidebar
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style>
.content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.content::-webkit-scrollbar-thumb {
  height: 40px;
  background-color: #aaa;
  border-radius: 16px;
}
.content::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
</style>