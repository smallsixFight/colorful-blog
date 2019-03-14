<template>
<div v-loading="loading">
    <div class="row">
        <div id="main" class="col-12 clearfix" role="main">
            <article class="posti">
                <h1 class="post-title" itemprop="name headline">{{article.title}}</h1>
                <div class="post-meta">
                    <p>
                        <time class="index-time" :datatime="article.created|unixTimeFormat">{{ article.created | blogTimeFormat }}</time> in 
                        {{ article.category }}
                    </p>
                </div>

                <div class="post-content" itemprop="articleBody">
                    <span v-html="article.content"></span>
                </div>

                <div style="display:block;margin-bottom:2em;" class="clearfix">
                    <section style="float:left;">
                        <span itemprop="keywords" class="tags">{{article.tags}}</span>
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
            article: {}
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
                    this.article = response.data.data
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
