<template>
  <div v-loading="loading">
    <div class="preface">我们所度过的每个日常，也许就是连续不断发生的奇迹。</div>
    <main class="article-list">
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
import bus from "@/bus";
export default {
  name: "articleList",
  data() {
    return {
      loading: false,
      page: 1,
      page_size: 8,
      article_list: [],
      total: 0,
      last_page: 0
    };
  },
  created: function() {
    bus.$on("page", page => {
      this.handleCurrentPageChange(page);
    });
    this.handleCurrentPageChange(1);
  },
  methods: {
    handleCurrentPageChange(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/visitor/article/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            const resp = response.data;
            this.total = resp.total;
            this.article_list = resp.data;
            this.page = val;
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
