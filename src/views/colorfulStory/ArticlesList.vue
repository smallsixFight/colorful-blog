<template>
  <div v-loading="loading">
    <div class="row">
      <div id="main" role="main">
        <ul class="post-list clearfix">
          <li class="post-item grid-item" v-for="article in article_list" :key="article.id">
            <router-link :to="'/article/' + article.id" class="post-link">
              <h3 class="post-title">
                <time
                  class="index-time"
                  :datatime="article.create_time"
                >{{ article.create_time.split(" ")[0] }}</time>
                <br />
                {{article.title}}
              </h3>
              <div class="post-meta">{{article.category}}</div>
            </router-link>
          </li>
        </ul>
      </div>
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
    <div class="row" v-else>
      <div class="nav-page">
        <ol class="page-navigator">
          <li>
            <a href="javascript:;" class="current">{{page}}</a>
          </li>
        </ol>
      </div>
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
            this.last_page = this.total / this.page_size + 1;
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
