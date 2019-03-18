<template>
<div v-loading="loading">
    <div class="row">
        <div id="main" class="col-12 clearfix" role="main">
            <article class="posti">
                <h1 class="post-title" itemprop="name headline">{{article.title}}</h1>
                <div class="post-meta">
                    <p>
                        <time class="index-time" :datatime="article.created|unixTimeFormat">{{ article.created | blogTimeFormat }}</time> in 
                        <router-link :to="{ path: '/categories', query: { mid: categoryList[0].mid, name: categoryList[0].name } }">
                            {{categoryList[0].name}}
                        </router-link>
                    </p>
                </div>

                <div class="post-content" itemprop="articleBody">
                    <span v-html="article.content"></span>
                </div>

                <div style="display:block;margin-bottom:2em;" class="clearfix">
                    <section style="float:left;" v-if="tagList.length > 0">
                        <span itemprop="keywords" class="tags">tag(s):</span>
                        <router-link  v-for="tag in tagList" :key="tag.mid"
                        :to="{ path: '/tags', query: { mid: tag.mid, name: tag.name } }">
                            {{tag.name}}
                        </router-link>
                    </section>
                    <section style="float:right;">
                        <!-- <span><a id="btn-comments" href="javascript:isComments();">show comments</a></span> ·  -->
                        <span>
                            <a href="#" @click="goBack">back</a>
                        </span> · 
                        <span>
                            <router-link to="/">home</router-link>
                        </span>
                    </section>
                </div>
            </article>
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
            article: {},
            categoryList: [],
            tagList: []
        }
    },
    created: function() {
        const cid = this.$route.params.id
        this.getArticle(cid);
    },
    methods: {
        goBack() {
          this.$router.go(-1);
        },
        getArticle(cid) {
            this.loading = true
            if (isNaN(cid)) {
                this.$router.replace("/404")
                return false
            }
            this.loading = true
            let params = {
                "cid": cid
            }
            this.$axios.get(this.HOST + `/api/getArticleWithPublish?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data
                    this.article = resp.data.article
                    this.categoryList = resp.data.categoryList
                    this.tagList = resp.data.tagList
                } else {
                    this.$router.replace("/404")
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>
