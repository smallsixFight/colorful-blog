<template>
    <div v-loading="loading">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1" @click="jump('articleList')">
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ statistics.articleNum || 0 }}</div>
                            <div>文章</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1" @click="jump('pageList')">
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ statistics.pageNum || 0 }}</div>
                            <div>页面</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1" @click="jump('commentList')">
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ statistics.commentNum || 0 }}</div>
                            <div>评论</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1" @click="jump('attachmentManagement')">
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ statistics.attachNum || 0 }}</div>
                            <div>附件</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover" style="height:260px;">
                    <div slot="header" class="clearfix">
                        <span>最新文章</span>
                    </div>
                        <el-table :data="articleList" size="small" :show-header="false" height="200" style="width: 100%;font-size:14px;">
                            <el-table-column>
                                <template v-slot:default="article">
                                    <span class="table-column-cell">{{ article.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center">
                                <template v-slot:default="article">
                                    <el-tag :type="article.row.status === 'publish' ? 'success' : 'warning'">
                                        {{article.row.status ==="publish" ? "已发布" : "草稿"}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column align="right">
                                <template v-slot:default="article">
                                    <span class="table-column-cell">{{ article.row.created | unixTimeFormat }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" style="height:260px;">
                    <div slot="header" class="clearfix">
                        <span>最新页面</span>
                    </div>
                        <el-table :data="pageList" size="small" :show-header="false" height="200" style="width: 100%;font-size:14px;">
                            <el-table-column>
                                <template v-slot:default="page">
                                    <span class="table-column-cell">{{ page.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot:default="page">
                                    <span class="table-column-cell">{{ page.row.slug }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center">
                                <template v-slot:default="page">
                                    <el-tag :type="page.row.status === 'publish' ? 'success' : 'warning'">
                                        {{page.row.status ==="publish" ? "已发布" : "草稿"}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column align="right">
                                <template v-slot:default="page">
                                    <span class="table-column-cell">{{ page.row.created | unixTimeFormat }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover" style="height:260px;">
                    <div slot="header" class="clearfix">
                        <span>最新评论</span>
                    </div>
                        <el-table :data="commentList" size="small" height="200" style="width: 100%;font-size:14px;">
                            <el-table-column label="评论者" align="center">
                                <template v-slot:default="comment">
                                    <span class="table-column-cell">{{ comment.row.author }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="评论内容" align="center">
                                <template v-slot:default="comment">
                                    <span class="table-column-cell">{{ comment.row.content }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" align="center">
                                <template v-slot:default="comment">
                                    <el-tag :type="comment.row.status === 'pass' ? 'success' : 'warning'">
                                        {{comment.row.status ==="pass" ? "通过" : "待审核"}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="日期" header-align="center">
                                <template v-slot:default="comment">
                                    <span class="table-column-cell">{{ comment.row.created | unixTimeFormat }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" style="height:260px;">
                    <div slot="header" class="clearfix">
                        <span>最新日志</span>
                    </div>
                        <el-table :data="attachList" size="small" height="200" style="width: 100%;font-size:14px;">
                            <el-table-column label="名称" align="center" header-align="center" width="200px;">
                                <template v-slot:default="attach">
                                    <span class="table-column-cell">{{ attach.row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="大小" align="center" header-align="center">
                                <template v-slot:default="attach">
                                    <span class="table-column-cell">{{ parseFloat(attach.row.size / 1024 / 1024).toFixed(3) }} MB</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="日期" align="center" header-align="center">
                                <template v-slot:default="attach">
                                    <span class="table-column-cell">{{ attach.row.created | unixTimeFormat }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" align="center" label="位置" header-align="center">
                                <template v-slot:default="attach">
                                    <span class="table-column-cell">{{ attach.row.place == 'local' ? "本地" : '七牛云' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            commentList: [],
            articleList: [],
            attachList: [],
            pageList: [],
            statistics: {},
            loading: false
        }
    },
    methods: {
        jump(param) {
            this.$router.replace(param)
        }
    },
    created: function() {
        this.loading = true
        this.$axios.get(this.HOST +  "/admin/api/dashboard")
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.commentList = resp.comments
                    this.articleList = resp.contents
                    this.attachList = resp.attaches
                    this.pageList = resp.pages
                    this.statistics = resp.statistics
                }
            }).finally( () => {
                this.loading = false
            })
    }
}
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.table-column-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.card {
    margin-bottom: 10px;
}
</style>

