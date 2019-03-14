<template>
    <div class="row" v-loading="loading">
        <div id="main" class="col-12 clearfix" role="main">
            <article class="posti">
                <h1 class="post-title" itemprop="title headline">{{page.title}}</h1>
                <div class="post-content" itemprop="pageBody">
                    <span v-html="page.content"></span>
                </div>
            </article>
        </div>
    </div>
</template>
<script>
import { stringify } from 'qs'
export default {
    data() {
        return {
            loading: false,
            page: {}
        }
    },
    created: function() {
        const cid = this.$route.params.cid
        if (isNaN(cid)) {
            this.$router.replace("/404")
            return false
        }
        this.getPage(cid);
    },
    methods: {
        getPage(param) {
            this.loading = true
            let params = {
                "cid": param
            }
            this.$axios.get(this.HOST + `/api/getPageWithPublish?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.page = response.data.data
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
