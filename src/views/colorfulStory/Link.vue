<template>
  <div class="row" v-loading="loading">
    <div id="main" class="col-12 clearfix" role="main">
      <article class="posti">
        <h1 style="text-align:right;" class="post-title">Friends</h1>
        <div itemprop="pageBody">
          <ul v-if="link_list.length > 0">
            <li v-for="link in link_list" :key="link.id">
              <a target="_blank" :title="link.description" :href="link.url">{{link.owner}}</a>
            </li>
          </ul>
          <span v-if="!link_list.length">暂无友链</span>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      link_list: []
    };
  },
  created: function() {
    this.loading = true;
    this.$axios
      .get(this.HOST + `/visitor/link/list`)
      .then(resp => {
        if (resp.data.success) {
          this.link_list = resp.data.data;
        } else {
          // this.$router.replace("/404")
          this.$message.error(resp.data.message);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>
