<template>
  <div v-loading="loading">
    <div class="row article-content">
      <div id="main" class="col-12 clearfix" role="main">
        <article class="posti">
          <h1 class="post-title" itemprop="name headline">{{article.title}}</h1>
          <div class="post-meta">
            <p>
              <time class="index-time" :datatime="article.create_time">{{ article.create_time }}</time> in
              <span v-if="category">
                <router-link
                  :key="category.id"
                  :to="{ path: '/category', query: { id: category.id, name: category.name } }"
                >{{category.name}}</router-link>
              </span>
            </p>
          </div>

          <div itemprop="articleBody">
            <span v-html="article.content"></span>
          </div>

          <div style="display:block;margin-bottom:2em;" class="clearfix">
            <section style="float:left;" v-if="tag_list && tag_list.length > 0">
              <span itemprop="keywords" class="tags">tag(s):</span>
              <router-link
                v-for="tag in tag_list"
                :key="tag.id"
                :to="{ path: '/tags', query: { id: tag.id, name: tag.name } }"
              >{{tag.name}}&nbsp;&nbsp;</router-link>
            </section>
            <section style="float:right;">
              <!-- <span><a id="btn-comments" href="javascript:isComments();">show comments</a></span> ·  -->
              <span>
                <a href="#" @click="goBack">back</a>&nbsp;
              </span>
            </section>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
const marked = require("marked");
export default {
  name: "Article",
  data() {
    return {
      loading: false,
      article: {},
      category: null,
      tag_list: []
    };
  },
  created: function() {
    this.getArticle(this.$route.params.id);
  },
  methods: {
    goHome() {
      this.$router.push("/articlesList");
    },
    goBack() {
      this.$router.go(-1);
    },
    getArticle(id) {
      this.loading = true;
      if (isNaN(id)) {
        this.$router.replace("/404");
        return false;
      }
      this.loading = true;
      this.$axios
        .get(this.HOST + `/visitor/article/info/` + id)
        .then(resp => {
          if (resp.data.success) {
            const data = resp.data.data;
            data.article.content = marked(data.article.content);
            data.article.create_time = data.article.create_time.split(" ")[0];
            this.article = data.article;
            this.category = data.category;
            this.tag_list = data.tag_list;
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
.article-content {
  background-color: #d5dbd9;
  margin-left: 10%;
  margin-right: 10%;
}
</style>