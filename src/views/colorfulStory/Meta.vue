<template>
    <div v-loading="loading">
        <div class="row">
            <div class="archive-header">
                <span>- {{metaType}} · {{metaName}} -</span>
            </div>
        </div>
        <div class="row" v-if="total > 0">
            <div id="main" role="main">
                <ul class="post-list clearfix">
                    <li class="post-item grid-item" itemscope itemtype="http://schema.org/BlogPosting" v-for="article in articlesList" :key="article.cid">
                        <router-link :to="'article/' + article.cid" class="post-link">
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
        <div v-if="total === 0" class="row">
            <span class="archive-header">暂无此类型文章 (,,• ₃ •,,) 
                <router-link to="archive">返回</router-link>
            </span>
            
        </div>
        <div class="row" v-if="total > 8">
            <div class="nav-page">
                <ol class="page-navigator">
                    <li v-if="hasPreviousPage" class="prev">
                        <a href="javascript:;" @click="getArticlesListByMid(prePage)">&laquo;</a>
                    </li>
                    <span v-if="firstPage < page-2">
                    <li>
                        <a href="javascript:;" @click="getArticlesListByMid(1)">{{1}}</a>
                    </li>
                    <li>
                        <a href="javascript:;">...</a>
                    </li>
                    </span>
                    <li v-if="prePage -1 >= firstPage">
                        <a href="javascript:;" @click="getArticlesListByMid(prePage -1)">{{prePage -1}}</a>
                    </li>
                    <li v-if="hasPreviousPage">
                        <a href="javascript:;" @click="getArticlesListByMid(page-1)">{{prePage}}</a>
                    </li>
                    <li>
                        <a href="javascript:;" class="current">{{page}}</a>
                    </li>
                    <li v-if="page+1 <= lastPage">
                        <a href="javascript:;" @click="getArticlesListByMid(page+1)">{{page+1}}</a>
                    </li>
                    <li v-if="page+2 <= lastPage">
                        <a href="javascript:;" @click="getArticlesListByMid(page+2)">{{page+2}}</a>
                    </li>
                    <span v-if="lastPage > page+2">
                        <li>
                        <a href="javascript:;">...</a>
                        </li>
                        <li>
                            <a href="javascript:;" @click="getArticlesListByMid(lastPage)">{{lastPage}}</a>
                        </li>
                    </span>
                    
                    <li v-if="hasNextPage" class="next">
                        <a href="javascript:;" @click="getArticlesListByMid(nextPage)">&raquo;</a>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script>
import { stringify } from 'qs'
export default {
    data() {
        return {
            loading: false,
            queryMid: 0,
            page: 1,
            pageSize: 8,
            metaName: '',
            metaType: '',
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
        if (!this.$route.query.mid || isNaN(this.$route.query.mid)) {
            this.$router.replace("/404")
            return false
        }
        const path = this.$route.path
        if (path === '/categories')
            this.metaType = 'Category'
        else 
            this.metaType = "Tag"
        this.queryMid = this.$route.query.mid
        this.metaName = this.$route.query.name
        this.getArticlesListByMid(1)
    },
    methods: {
        getArticlesListByMid(page) {
            this.loading = true
            let queryData = {
                "mid": this.queryMid,
                "page": page,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/api/getArticleByNameType?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data.data
                    this.total = resp.total
                    this.articlesList = resp.list,
                    this.page = page,
                    this.hasPreviousPage = resp.hasPreviousPage,
                    this.hasNextPage = resp.hasNextPage,
                    this.prePage = resp.prePage,
                    this.nextPage = resp.nextPage,
                    this.lastPage = resp.lastPage,
                    this.firstPage = resp.firstPage
                } else if (response.data.code === 1) {
                    this.$message.warning(response.data.message)
                } else
                    this.$message.error(response.data.message)
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>

