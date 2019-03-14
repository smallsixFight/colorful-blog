<template>
    <div class="row" v-loading="loading">
        <div id="main" class="col-12 clearfix" role="main">
            <article class="posti">
                <h1 style="text-align:right;" class="post-title">Friends</h1>
                <div class="post-content" itemprop="pageBody">
                    <ul v-if="linkList.length > 0">
                        <li v-for="link in linkList" :key="link.id">
                            <a target="_blank" :href="link.content">{{link.owner}}</a>
                        </li>
                    </ul>
                    <span v-if="linkList.length === 0">暂无友链</span>
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
            linkList: []
        }
    },
    created: function() {
        this.loading = true
        this.$axios.get(this.HOST + `/api/getLinkList`)
            .then(response => {
                if (response.data.code === 0) {
                    this.linkList = response.data.data
                } else if(response.data.code === 1) {
                    this.$router.replace("/")
                    this.$message.warning(response.data.message)
                } else {
                    this.$router.replace("/404")
                    this.$message.error(response.data.message)
                }
            }).finally( () => {
                this.loading = false
        })
    }
}
</script>
