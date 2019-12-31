<template>
  <div v-loading="loading">
    <div class="preface">- {{meta_type}} · {{name}} -</div>
    <main class="article-list" v-if="total > 0">
      <router-link v-for="article in article_list" :key="article.id" :to="'/article/' + article.id">
        <a class="cube">
          <div class="category">{{article.category}}</div>
          <div class="bottom">
            <span class="time">{{ article.create_time.split(" ")[0] }}</span>
            <span class="title">{{article.title}}</span>
          </div>
        </a>
      </router-link>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </main>
    <main v-if="total === 0" style="text-align: center; margin: 2rem;">
      <p>暂无此类型文章 (,,• ₃ •,,)</p>
      <a @click="goBack" class="go-back">返回</a>
    </main>
    <div class="pagination" v-if="total > 8">
      <a v-if="page -2 >=2" @click="handleCurrentPageChange(1)">1</a>
      <a v-if="page -2 >2">...</a>
      <a v-if="page -2 >0" @click="handleCurrentPageChange(page -2)">{{page -2}}</a>
      <a v-if="page -1 >0" @click="handleCurrentPageChange(page -1)">{{page -1}}</a>
      <a class="current">{{page}}</a>
      <a v-if="page +1 <= last_page" @click="handleCurrentPageChange(page +1)">{{page +1}}</a>
      <a v-if="page +2 <= last_page" @click="handleCurrentPageChange(page +2)">{{page +2}}</a>
      <a v-if="page +2 < last_page">...</a>
      <a v-if="page +2 <last_page" @click="handleCurrentPageChange(last_page)">{{last_page}}</a>
    </div>
    <div class="pagination" v-else>
      <a class="current">{{page}}</a>
    </div>
  </div>
</template>
<script>
import { stringify } from "qs";
export default {
  data() {
    return {
      loading: false,
      id: 0,
      page: 1,
      page_size: 8,
      name: "",
      meta_type: "",
      article_list: [],
      total: 0,
      last_page: 0
    };
  },
  created: function() {
    if (!this.$route.query.id || isNaN(this.$route.query.id)) {
      this.$router.replace("/404");
      return false;
    }
    const path = this.$route.path;
    if (path === "/category") {
      this.meta_type = "Category";
    } else {
      this.meta_type = "Tag";
    }
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;
    this.handleCurrentPageChange(1);
  },
  methods: {
    handleCurrentPageChange(page) {
      this.loading = true;
      let queryData = {
        mid: this.id,
        page: page,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/visitor/article/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            const resp = response.data;
            this.total = resp.total;
            this.article_list = resp.data;
            this.page = page;
            this.last_page = Math.ceil(this.total / this.page_size);
          } else {
            this.$message.error(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style>
.current {
  border-bottom: 1px solid #414141;
}
</style>