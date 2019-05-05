<template>
    <div v-loading="loading" class="body">
        <h1 style="text-align:center;">我的书单</h1>
        <hr/>
        <h2>在读</h2>
        <div class="douban-book-list doubanboard-list">
            <div
                class="doubanboard-item"
                v-for="item in bookInfo.readingBookList"
                :key="item.photoUrl"
                :title="item.name">
                <div class="doubanboard-thumb" :style="{backgroundImage:'url(' + item.photoUrl + ')'}"></div>
                <div class="doubanboard-title">{{item.name}}</div>
            </div>
        </div>
        <hr/>
        <h2>想读</h2>
        <div class="douban-book-list doubanboard-list">
            <div
                class="doubanboard-item"
                v-for="item in bookInfo.wishReadBookList"
                :key="item.photoUrl"
                :title="item.name">
                <div class="doubanboard-thumb" :style="{backgroundImage:'url(' + item.photoUrl + ')'}"></div>
                <div class="doubanboard-title">{{item.name}}</div>
            </div>
        </div>
        <hr/>
        <h2>读过</h2>
        <div class="douban-book-list doubanboard-list">
            <div
                class="doubanboard-item"
                v-for="item in bookInfo.readBookList"
                :key="item.photoUrl"
                :title="item.name">
                <div class="doubanboard-thumb" :style="{backgroundImage:'url(' + item.photoUrl + ')'}"></div>
                <div class="doubanboard-title">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            bookInfo: {},
        }
    },
    created: function() {
        this.getBookInfo();
    },
    methods: {
        getBookInfo() {
            this.loading = true
            this.$axios.get(this.HOST + `/api/getBookInfo`)
            .then(response => {
                if (response.data.code !== 0) {
                    this.$message.error(response.data.message)
                }
                this.bookInfo = response.data.data
            }).finally( () => {
                this.loading = false
            })
        }
    }

}
</script>

<style scope>
.body {
    margin: 5%;
}

.doubanboard-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    max-width: 100%;
    margin-top: 1em;
}
.doubanboard-list,.doubanboard-list * {
    box-sizing: border-box;
}
.doubanboard-item {
    position: relative;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    transition: ease all 0.3s;
    overflow: hidden;
    background: #f7fbf7;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    border: none!important;
    display: block;
}
.doubanboard-thumb {
    width: 100%;
    padding-top: 141%;
    background-repeat: no-repeat;
    background-size: cover;
}
.doubanboard-title,.doubanboard-title a {
    margin: 8px 0!important;
    font-size: 1.2em!important;
    overflow: hidden!important;
    text-overflow: ellipsis!important;
    white-space: nowrap !important;
    text-align: center !important;
    color: #202020 !important;
    font-weight: 700 !important;
    border:none !important;
}

@media screen and (min-width:769px) {
    .doubanboard-item{
        width: 12%;
        min-width: 12%;
        max-width: 12%;
        margin: 2%;
        margin-left: 8%;
        /* margin-right: 5%; */
    }
}
@media screen and (max-width:400px) {
    .doubanboard-item{
        width: 45%;
        min-width: 45%;
        max-width: 45%;
        margin: 2.5%;
    }
}
</style>
