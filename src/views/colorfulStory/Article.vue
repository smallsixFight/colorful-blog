<template>
  <div v-loading="loading" class="article-body">
    <main class="article">
      <article>
        <h1 class="title">{{article.title}}</h1>
        <p class="article-meta">
          <time>{{ article.create_time }}</time> in
          <router-link
            v-if="category"
            :key="category.id"
            :to="{ path: '/category', query: { id: category.id, name: category.name } }"
          >
            <a class="category">{{category.name}}</a>
          </router-link>
        </p>
        <div v-highlight>
          <span v-html="article.content"></span>
        </div>
        <div class="tags" v-if="tag_list && tag_list.length > 0">
          <span>
            <router-link
              v-for="tag in tag_list"
              :key="tag.id"
              :to="{ path: '/tags', query: { id: tag.id, name: tag.name } }"
            >{{tag.name}}
            </router-link>
          </span>
        </div>
      </article>
    </main>
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