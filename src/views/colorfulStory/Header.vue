<template ref="header">
  <header id="header" class="clearfix" v-loading="loading">
    <div class="container-fluid">
      <div class="row">
        <div class="logo">
          <div class="header-logo">
            <a href="javascript:;" @click="firstPage()">
              <span class="b">首页</span>
            </a>
            <a target="_blank" :href="github_url">
              <span class="b">Gitub</span>
            </a>
            <router-link to="/read">
              <span class="b">读书</span>
            </router-link>
            <router-link to="/archive">
              <span class="b">归档</span>
            </router-link>
            <router-link to="/link" v-if="has_link">
              <span class="b">友链</span>
            </router-link>
            <span v-for="pageInfo in page_list" :key="pageInfo.id">
              <router-link :to="'/page/' + pageInfo.id" :index="pageInfo.id">
                <span class="b">{{ pageInfo.title }}</span>
              </router-link>
            </span>
          </div>
          <div id="menu-page">
            <!-- <@commonTag method="menus">
                            <#list menus?sort_by('menuSort') as menu>
                                <a href="${menu.menuUrl}"><li>${menu.menuName}</li></a>
                            </#list>
            </@commonTag>-->
          </div>
          <div id="search-box">
            <form id="search" method="post" action="./" role="search">
              <input
                autocomplete="off"
                type="text"
                name="s"
                id="menu-search"
                placeholder="Type something~"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import bus from "@/bus";
export default {
  data() {
    return {
      loading: false,
      has_link: false,
      github_url: "https://github.com",
      page_list: []
    };
  },
  created: function() {
    this.getInitData();
  },
  methods: {
    firstPage() {
      bus.$emit("page", 1);
    },
    getInitData() {
      this.loading = true;
      this.$axios
        .get(this.HOST + `/visitor/index/info`)
        .then(response => {
          if (response.data.success) {
            const resp = response.data.data;
            document.title = resp.blog_name ? resp.blog_name : "Colorful Blog";
            this.has_link = resp.has_link;
            this.github_url = resp.github_url && resp.github_url;
            this.page_list = resp.page_list;
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/main.css";
</style>