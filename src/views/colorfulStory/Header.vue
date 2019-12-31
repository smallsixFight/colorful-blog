<template>
  <header v-loading="loading">
    <nav>
      <ul class="navigation">
        <li>
            <a href="javascript:;" @click="firstPage()">首页</a>
        </li>
        <li>
          <a target="_blank" :href="github_url">Github</a>
        </li>
        <li>
          <router-link to="/read">
            <a>读书</a>
          </router-link>
        </li>
        <li>
          <router-link to="/link">
            <a>友链</a>
          </router-link>
        </li>
        <li>
          <router-link to="/archive">
            <a>归档</a>
          </router-link>
        </li>
        <li v-for="pageInfo in page_list" :key="pageInfo.id">
          <router-link :to="'/page/' + pageInfo.id" :index="pageInfo.id">
            <a>{{ pageInfo.title }}</a>
          </router-link>
        </li>
      </ul>
    </nav>
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
      if (window.location.pathname !== "/articlesList") {
        this.$router.replace("/articlesList");
      }
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