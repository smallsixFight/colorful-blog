<template>
    <header id="header" class="clearfix" v-loading="loading">
        <div class="container-fluid">
            <div class="row">
                <div class="logo">
                    <div class="header-logo">
                        <router-link to="/">
                            <span class="b">Start</span>
                        </router-link>
                        <a target="_blank" href="https://gitHub.com/smallsixFight">
                            <span class="b">GitHub</span>
                        </a>
                        <router-link to="/read">
                            <span class="b">Read</span>
                        </router-link>
                        <router-link to="/archive">
                            <span class="b">Archive</span>
                        </router-link>
                        <router-link to="/link" v-if="hasLink">
                            <span class="b">Friend</span>
                        </router-link>
                        <span v-for="customPage in customPageList" :key='customPage.cid'>
                            <router-link :to="'/page/' + customPage.cid" :index="customPage.cid">
                                <span class="b">{{ customPage.slug || customPage.title }}</span>
                            </router-link>
                        </span>
                        
                    </div>
                    <div id="menu-page">
                        <!-- <@commonTag method="menus">
                            <#list menus?sort_by('menuSort') as menu>
                                <a href="${menu.menuUrl}"><li>${menu.menuName}</li></a>
                            </#list>
                        </@commonTag> -->
                    </div>
                    <div id="search-box">
                        <form id="search" method="post" action="./" role="search">
                            <input autocomplete="off" type="text" name="s" id="menu-search" placeholder="Type something~" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            hasLink: false,
            customPageList: []
        }
    },
    created: function() {
        this.getInitData();
    },
    methods: {
        getInitData() {
            this.loading = true
            this.$axios.get(this.HOST + `/api/initData`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data.data
                    document.title = resp.blogName + "’ Blog"
                    this.hasLink = resp.hasPublishLink
                    this.customPageList = resp.pageList
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
    }
}
</script>


<style scoped>
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/main.css";
</style>