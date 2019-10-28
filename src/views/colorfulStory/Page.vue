<template>
  <div class="row page-content" v-loading="loading">
    <div id="main" class="col-12 clearfix" role="main">
      <article class="posti">
        <h1 class="post-title" itemprop="title headline">{{page_info.title}}</h1>
        <div itemprop="pageBody">
          <span v-html="page_info.content"></span>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
const marked = require("marked");
export default {
  data() {
    return {
      loading: false,
      page_info: {}
    };
  },
  created: function() {
    const id = this.$route.params.id;
    if (isNaN(id)) {
      this.$router.replace("/404");
      return false;
    }
    this.getPageInfo(id);
  },
  methods: {
    getPageInfo(param) {
      this.loading = true;
      this.$axios
        .get(this.HOST + `/visitor/page/info/` + param)
        .then(resp => {
          if (resp.data.success) {
            this.page_info = resp.data.data;
            this.page_info.content = marked(this.page_info.content);
          } else {
            this.$router.replace("/404");
            this.$message.warning(resp.data.message);
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
.page-content {
  background-color: #d5dbd9;
  margin-left: 10%;
  margin-right: 10%;
}
</style>