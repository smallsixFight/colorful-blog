<template>
    <div class="row" v-loading="loading">
        <div id="main" class="col-12 clearfix" role="main">
            <article class="posti" itemscope itemtype="http://schema.org/BlogPosting">
                <!-- 总分类&标签 -->
                <h3>Something</h3>
                <div class="post-tags">
                    <!-- 分类 -->
                    <h4>Category</h4>
                    <ul v-if="categories" class="a_tag">
                        <li v-for="category in categories" :key="category.mid">
                            <router-link :to="{ path: 'categories', query: { mid: category.mid, name: category.name } }">
                                {{category.name}}
                            </router-link>
                        </li>
                    </ul>
                    <!-- 标签 -->
                    <h4>Tag</h4>
                    <ul v-if="tags" class="a_tag">
                        <li v-for="tag in tags" :key="tag.mid">
                            <router-link :to="{ path: 'tags', query: { mid: tag.mid, name: tag.name } }">
                                {{tag.name}}
                            </router-link>
                        </li>
                    </ul>
                </div>

                <h3>Post</h3>
                <div id="archives" v-if="articles">
                    <div v-for="item in articles" :key="item.date">
                        <h3>{{item.date}}</h3>
                        <ul>
                            <li v-for="article in item.articles" :key="article.cid">
                                {{ article.created | archiveTimeFormat }}
                                <router-link :to="'article/' + article.cid">
                                    {{article.title}}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            categories: [],
            tags: [],
            articles: []
        }
    },
    created: function() {
        this.getArchiveInfo();
    },
    methods: {
        getArchiveInfo() {
            this.$axios.get(this.HOST + `/api/archivesInfo`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data.data
                    this.categories = resp.metaArchive.categories
                    this.tags = resp.metaArchive.tags
                    this.articles = resp.articleArchive
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

