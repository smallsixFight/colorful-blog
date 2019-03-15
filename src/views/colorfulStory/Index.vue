<template>
    <div class="index">
        <!-- <div class="background-image"></div> -->
        <v-header></v-header>
        <div id="body" class="container-fluid">
            <transition name="move" mode="out-in">
                <keep-alive include="articleList,meta" :max="1">
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
        <v-footer></v-footer>
    </div>
</template>

<script>
import vHeader from './Header.vue'
import vFooter from './Footer.vue'
export default {
    name: "index",
    components: {
        vHeader,
        vFooter
    }
}
</script>

<style>
.index {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.index::before {
    /* position: relative; */
    background-image: url();
    content: '';
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.15;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
}
.index::-webkit-scrollbar {
    width:8px;
    height:8px;
}
.index::-webkit-scrollbar-thumb {
    height:40px;
    background-color:#eee; 
    border-radius: 16px;
}
.index::-webkit-scrollbar-thumb:hover {
    background-color:#ddd;
}
</style>

