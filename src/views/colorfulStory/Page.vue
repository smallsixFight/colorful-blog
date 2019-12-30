<template>
  <div class="page-body" v-loading="loading">
    <main class="page">
      <div class="page-info">
        <h1 class="title">{{page_info.title}}</h1>
        <p class="page-meta"><time>{{page_info.create_time.split(" ")[0]}}</time></p>
        <div>
          <span v-html="page_info.content"></span>
        </div>
      </div>
    </main>
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