<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>自定义页面</span>
        </el-card>
        <el-card>
            <el-table :data="pageList" style="width: 100%;font-size:14px;">
                <el-table-column align="center" label="标题" header-align="center" width="400px">
                    <template v-slot:default="page">
                        <span class="table-column-cell">{{ page.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created" align="center" label="创建日期" header-align="center">
                </el-table-column>
                <el-table-column prop="modified" align="center" label="最近修改日期" header-align="center">
                </el-table-column>
                <el-table-column align="center" label="自定义路径" header-align="center">
                    <template v-slot:default="page">
                        <span class="table-column-cell">{{ page.row.slug }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" header-align="center">
                    <template v-slot:default="page">
                        <el-tag :type="page.row.status === 'publish' ? 'success' : 'warning'">
                            {{page.row.status ==="publish" ? "已发布" : "草稿"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="article">
                        <el-button type="text" size="small" @click="handleEdit(article.row.cid)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(article.row)">删除</el-button>
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
import { stringify } from 'qs'
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            delVisible: false,
            delParams: {},
            total: 0,
            pageList: [],
            loading: false
        }
    }, 
    created: function() {
        this.handleCurrentPageChange(1);
    },
    methods: {
        handleDelete(params) {
            this.delVisible = true
            this.delParams = params
        },
        submitDelete() {
            this.loading = true
            let params = {
                "cid": this.delParams.cid
            }
            this.$axios.delete(this.HOST + `/admin/api/delPage?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.delVisible = false
                    this.$message.success(response.data.message)
                    this.handleCurrentPageChange(this.page)
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        closeDelDialog() {
            this.delVisible = false
            this.delParams = {}
        },
        handleEdit(cid) {
            this.$router.push({path: '/admin/pageEdit', query: { cid: cid}})
        },
        handleCurrentPageChange: function(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/pageList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.pageList = resp.list,
                    this.page = val
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>