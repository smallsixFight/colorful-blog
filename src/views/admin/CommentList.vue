<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>评论管理</span>
        </el-card>
        <el-card>
            <el-table :data="commentList" style="width: 100%;font-size:14px;">
                <el-table-column label="评论者" width="100px" header-align="center" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.author }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" width="500px" header-align="center" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" header-align="center" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.mail }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="日期" header-align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.created | unixTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" header-align="center">
                    <template v-slot:default="comment">
                        <el-tag :type="comment.row.status === 1 ? '' : 'warning'">
                            {{comment.row.status === 1 ? "通过" : "待审核"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="comment">
                        <el-button type="text" size="small" v-if="comment.row.status !== 1" @click="handlePass(comment.row.coid)">通过</el-button>
                        <el-button type="text" size="small" @click="handleDelete(comment.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="table-pagination"
                layout="->, prev, pager, next"
                :total="total" 
                :current-page.sync="page"
                @current-change="handleCurrentPageChange">
            </el-pagination>
        </el-card>
        <el-dialog :visible.sync="delVisible" title="删除" width="20%" @closed="closeDelDialog">
            <span>确定删除吗？</span>
            <span slot="footer">
                <el-button @click="closeDelDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="submitDelete" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { stringify } from 'qs';
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            commentList: [],
            loading: false,
            delVisible: false,
            delParams: {}
        }
    },
    created: function() {
        this.handleCurrentPageChange(1);
    },
    methods: {
        handlePass(coid) {
            this.loading = true
            let params = {
                coid: coid
            }
            this.$axios.get(this.HOST + `/admin/api/passComment?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.delVisible = false
                    this.handleCurrentPageChange(this.page)
                    this.$message.success(response.data.message)
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        handleDelete(params) {
            this.delVisible = true
            this.delParams = params
        },
        submitDelete() {
            this.loading = true
            let params = {
                "coid": this.delParams.coid
            }
            this.$axios.delete(this.HOST + `/admin/api/delComment?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.delVisible = false
                    this.handleCurrentPageChange(this.page)
                    this.$message.success(response.data.message)
                } else {
                    this.$message.warning(response.data.message)
                    this.delVisible = false
                }
            }).finally( () => {
                this.loading = false
            })
        },
        closeDelDialog() {
            this.delVisible = false
            this.delParams = {}
        },
        handleCurrentPageChange: function(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/commentList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.commentList = resp.list,
                    this.page = val
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>

