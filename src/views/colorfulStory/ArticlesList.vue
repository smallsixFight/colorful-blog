<template>
<div v-loading="loading">
    <div class="row">
        <div id="main" role="main">
            <ul class="post-list clearfix">
                <li class="post-item grid-item" itemscope itemtype="http://schema.org/BlogPosting" v-for="article in articlesList" :key="article.cid">
                    <router-link :to="'/article/' + article.cid" class="post-link">
                        <h3 class="post-title">
                            <time class="index-time" :datatime="article.created|unixTimeFormat">{{ article.created | blogTimeFormat }}</time><br>
                            {{article.title}}
                        </h3>
                        <div class="post-meta">
                            {{article.category}}
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
    <div class="row" v-if="total > 8">
		<div class="nav-page">
			<ol class="page-navigator">
                <li v-if="hasPreviousPage" class="prev">
                    <a href="javascript:;" @click="handleCurrentPageChange(prePage)">&laquo;</a>
                </li>
                <span v-if="firstPage < page-2">
                <li>
                    <a href="javascript:;" @click="handleCurrentPageChange(1)">{{1}}</a>
                </li>
                <li>
                    <a href="javascript:;">...</a>
                </li>
                </span>
                <li v-if="prePage -1 >= firstPage">
                    <a href="javascript:;" @click="handleCurrentPageChange(prePage -1)">{{prePage -1}}</a>
                </li>
                <li v-if="hasPreviousPage">
                    <a href="javascript:;" @click="handleCurrentPageChange(page-1)">{{prePage}}</a>
                </li>
                <li>
                    <a href="javascript:;" class="current">{{page}}</a>
                </li>
                <li v-if="page+1 <= lastPage">
                    <a href="javascript:;" @click="handleCurrentPageChange(page+1)">{{page+1}}</a>
                </li>
                <li v-if="page+2 <= lastPage">
                    <a href="javascript:;" @click="handleCurrentPageChange(page+2)">{{page+2}}</a>
                </li>
                <span v-if="lastPage > page+2">
                    <li>
                    <a href="javascript:;">...</a>
                    </li>
                    <li>
                        <a href="javascript:;" @click="handleCurrentPageChange(lastPage)">{{lastPage}}</a>
                    </li>
                </span>
                
                <li v-if="hasNextPage" class="next">
                    <a href="javascript:;" @click="handleCurrentPageChange(nextPage)">&raquo;</a>
                </li>
			</ol>
		</div>
	</div>
</div>
</template>
<script>
import { stringify } from 'qs'
export default {
    name: "articleList",
    data() {
        return {
            loading: false,
            page: 1,
            articlesList: [],
            total: 0,
            hasPreviousPage: false,
            hasNextPage: false,
            prePage: 0,
            nextPage: 1,
            firstPage: 0,
            lastPage: 0
        }
    },
    created: function() {
        this.handleCurrentPageChange(1)
    },
    methods: {
        handleCurrentPageChange(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/api/getArticleList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data.data
                    this.total = resp.total
                    this.articlesList = resp.list,
                    this.page = val,
                    this.hasPreviousPage = resp.hasPreviousPage,
                    this.hasNextPage = resp.hasNextPage,
                    this.prePage = resp.prePage,
                    this.nextPage = resp.nextPage,
                    this.lastPage = resp.lastPage,
                    this.firstPage = resp.firstPage
                } else {
                    this.$message.error(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>
<style>
.current {
    border-bottom: 1px solid #414141;
}
</style>
