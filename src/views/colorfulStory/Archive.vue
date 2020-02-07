<template>
  <div v-loading="loading">
    <div class="preface">是否变得怠惰了呢？</div>
    <div class="archive">
    <div class="archive-list" v-if="article_list">
          <div class="item" v-for="item in article_list" :key="item.date">
            <h3>{{item.date}}</h3>
            <ul>
              <li v-for="article in item.article_list" :key="article.id">
                {{ article.create_time.split(" ")[0].substring(5) }}
                <router-link :to="'article/' + article.id">{{article.title}}</router-link>
              </li>
            </ul>
        </div>
    </div>
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

