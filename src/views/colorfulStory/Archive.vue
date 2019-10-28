<template>
  <div class="row" v-loading="loading">
    <div id="main" class="col-12 clearfix" role="main">
      <article class="posti" itemscope itemtype="http://schema.org/BlogPosting">
        <h3>归档</h3>
        <div id="archives" v-if="article_list">
          <div v-for="item in article_list" :key="item.date">
            <h4>{{item.date}}</h4>
            <ul>
              <li v-for="article in item.article_list" :key="article.id">
                {{ article.create_time.split(" ")[0].substring(5) }}
                <router-link :to="'article/' + article.id">{{article.title}}</router-link>
              </li>
            </ul>
          </div>
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
      article_list: []
    };
  },
  created: function() {
    this.getArchiveInfo();
  },
  methods: {
    getArchiveInfo() {
      this.loading = true;
      this.$axios
        .get(this.HOST + `/visitor/archive/info`)
        .then(resp => {
          if (resp.data.success) {
            this.article_list = resp.data.data;
          } else {
            this.$message.error(resp.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

