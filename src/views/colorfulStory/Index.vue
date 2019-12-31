<template>
  <div style="width: 98vw; max-width: 100%;">
    <div class="bg"></div>
    <v-header></v-header>
      <transition name="move" mode="out-in">
        <keep-alive include="articleList" exclude="Article">
          <router-view></router-view>
        </keep-alive>
      </transition>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from "./Header.vue";
import vFooter from "./Footer.vue";
export default {
  name: "index",
  components: {
    vHeader,
    vFooter
  }
};
</script>