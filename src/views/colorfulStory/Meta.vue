<template>
  <div v-loading="loading">
    <div class="row">
      <div class="archive-header">
        <span>- {{meta_type}} · {{name}} -</span>
      </div>
    </div>
    <div class="row" v-if="total > 0">
      <div id="main" role="main">
        <ul class="post-list clearfix">
          <li
            class="post-item grid-item"
            itemscope
            itemtype="http://schema.org/BlogPosting"
            v-for="article in article_list"
            :key="article.id"
          >
            <router-link :to="'article/' + article.id" class="post-link">
              <h3 class="post-title">
                <time class="index-time" :datatime="article.create_time">{{ article.create_time }}</time>
                <br />
                {{article.title}}
              </h3>
              <div class="post-meta">{{article.category}}</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="total === 0" class="row">
      <span class="archive-header">
        暂无此类型文章 (,,• ₃ •,,)
        <router-link to="archive">返回</router-link>
      </span>
    </div>
    <div class="row" v-if="total > 8">
      <div class="nav-page">
        <ol class="page-navigator">
          <span v-if="page -2 >=2">
            <li>
              <a href="javascript:;" @click="handleCurrentPageChange(1)">{{1}}</a>
            </li>
            <li v-if="page -2 >2">
              <a href="javascript:;">...</a>
            </li>
          </span>
          <li v-if="page -2 >0">
            <a href="javascript:;" @click="handleCurrentPageChange(page -2)">{{page -2}}</a>
          </li>
          <li v-if="page -1 >0">
            <a href="javascript:;" @click="handleCurrentPageChange(page -1)">{{page -1}}</a>
          </li>
          <li>
            <a href="javascript:;" class="current">{{page}}</a>
          </li>
          <li v-if="page +1 <= last_page">
            <a href="javascript:;" @click="handleCurrentPageChange(page +1)">{{page +1}}</a>
          </li>
          <li v-if="page +2 <= last_page">
            <a href="javascript:;" @click="handleCurrentPageChange(page +2)">{{page +2}}</a>
          </li>
          <span>
            <li v-if="page +2 < last_page">
              <a href="javascript:;">...</a>
            </li>
            <li v-if="page +2 < last_page">
              <a href="javascript:;" @click="handleCurrentPageChange(last_page)">{{last_page}}</a>
            </li>
          </span>
        </ol>
      </div>
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
            this.last_page = Math.ceil(this.total /this.page_size);
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