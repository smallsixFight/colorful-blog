<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>评论管理</span>
        </el-card>
        <el-card>
            <el-table :data="comment_list" style="width: 100%;font-size:14px;">
                <el-table-column label="评论者" width="100px" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.commentator }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" width="500px" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标题" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell" v-if="comment.row.content_id">{{ comment.row.content_title }}</span>
                        <el-tag type="warning" v-else>已被删除</el-tag>
                        
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.mail }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="日期" header-align="center">
                    <template v-slot:default="comment">
                        <span class="table-column-cell">{{ comment.row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" header-align="center">
                    <template v-slot:default="comment">
                        <el-tag :type="comment.row.status ? '' : 'warning'">
                            {{comment.row.status ? "通过" : "待审核"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="comment">
                        <el-button type="text" size="small" v-if="!comment.row.status" @click="handlePass(comment.row.id)">通过</el-button>
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
        <el-dialog :visible.sync="del_visible" title="删除" width="20%" @closed="closeDelDialog">
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
            page_size: 10,
            total: 0,
            comment_list: [],
            loading: false,
            del_visible: false,
            del_params: {}
        }
    },
    created: function() {
        this.handleCurrentPageChange(1);
    },
    methods: {
        handlePass(id) {
            this.loading = true
            let params = {
                id: id
            }
            this.$axios.get(this.HOST + `/admin/api/passComment?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.del_visible = false
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
            this.del_visible = true
            this.del_params = params
        },
        submitDelete() {
            this.loading = true
            this.$axios.delete(this.HOST + `/admin/comment/del/` + this.del_params.id)
            .then(response => {
                if (response.data.code === 0) {
                    this.del_visible = false
                    this.handleCurrentPageChange(this.page)
                    this.$message.success(response.data.message)
                } else {
                    this.$message.warning(response.data.message)
                    this.del_visible = false
                }
            }).finally( () => {
                this.loading = false
            })
        },
        closeDelDialog() {
            this.del_visible = false
            this.del_params = {}
        },
        handleCurrentPageChange: function(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "page_size": this.page_size
            }
            this.$axios.get(this.HOST + `/admin/comment/list?${stringify(queryData)}`)
            .then(response => {
                if (response.data.success) {
                    let resp = response.data
                    this.total = resp.total
                    this.comment_list = resp.data,
                    this.page = val
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>

