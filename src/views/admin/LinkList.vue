<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>友链管理</span>
        </el-card>
        <el-card>
            <el-button type="primary" size="small" @click="dialogFormVisible = true">新增</el-button>
            <el-table :data="linkList" style="width: 100%;font-size:14px;">
                <el-table-column label="名称" header-align="center" align="center">
                    <template v-slot:default="link">
                        <span class="table-column-cell">{{ link.row.content }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所有者" header-align="center" align="center">
                    <template v-slot:default="link">
                        <span class="table-column-cell">{{ link.row.owner }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="描述" header-align="center" align="center">
                    <template v-slot:default="link">
                        <span class="table-column-cell">{{ link.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" align="center">
                    <template v-slot:default="link">
                        <el-tag :type="link.row.status === 'publish' ? '' : 'success'">
                            {{ link.row.status ==="publish" ? "发布" : "待发布" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建日期" header-align="center">
                    <template v-slot:default="link">
                        <span class="table-column-cell">{{ link.row.created | unixTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="最新修改日期" header-align="center">
                    <template v-slot:default="link">
                        <span class="table-column-cell">{{ link.row.modified | unixTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="link">
                        <el-button type="text" size="small" @click="handleEdit(link.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(link.row)">删除</el-button>
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
        <el-dialog :visible.sync="dialogFormVisible" title="新增" width="420px" @closed="closeDialog">
            <el-form>
                <el-form-item label="名 称">
                    <el-input autocomplete="off" style="width: 300px;" v-model="content"></el-input>
                </el-form-item>
                <el-form-item label="主 人">
                    <el-input autocomplete="off" style="width: 300px;" v-model="owner"></el-input>
                </el-form-item>
                <el-form-item label="状 态">
                    <el-select v-model="status" style="width: 300px;">
                        <el-option label="发布" value="publish"></el-option>
                        <el-option label="待发布" value="draft"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描 述">
                    <el-input style="width: 300px;" type="textarea" :rows="3" v-model="description"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center;">
                    <el-button type="primary" @click="submit" size="small">保存</el-button>
                    <el-button @click="closeDialog" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
import { stringify } from "qs"
export default {
    data() {
        return {
            content: '',
            page: 1,
            pageSize: 10,
            owner: '',
            description: '',
            status: 'draft',
            total: 0,
            linkList: [],
            loading: false,
            dialogFormVisible: false,
            delVisible: false,
            delParams: {}
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
                "id": this.delParams.id
            }
            this.$axios.delete(this.HOST + `/admin/api/delLink?${stringify(params)}`)
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
        handleEdit(params) {
            this.id = params.id
            this.content = params.content
            this.owner = params.owner
            this.status = params.status
            this.description = params.description
            this.dialogFormVisible = true
        },
        submit() {
            let params = {
                id: this.id,
                content: this.content,
                owner: this.owner,
                status: this.status,
                description: this.description
            }
            this.$axios.post(this.HOST + "/admin/api/addOrUpdateLink", {
                ...params
            }).then(response => {
                if (response.data.code === 0) {
                    this.dialogFormVisible = false
                    this.$message.success(response.data.message)
                    this.handleCurrentPageChange(this.page)
                } else {
                    this.$message.warning(response.data.message)
                }
            })
        },
        closeDialog() {
            this.id = ''
            this.content = ''
            this.owner = ''
            this.status = 'draft'
            this.description = ''
            this.dialogFormVisible = false
        },
        handleCurrentPageChange: function(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/linkList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.linkList = resp.list,
                    this.page = val
                }
            }).finally( () => {
                this.loading = false
            })
        }
    }
}
</script>

