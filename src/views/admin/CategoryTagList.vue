<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>分类 / 标签</span>
        </el-card>
        <el-card>
            <el-button type="primary" size="small" @click="dialogFormVisible = true">新增</el-button>
            <el-table :data="categoryTagList" style="width: 100%;font-size:14px;">
                <el-table-column label="名称" header-align="center" align="center">
                    <template v-slot:default="categoryTag">
                        <span class="table-column-cell">{{ categoryTag.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" header-align="center" align="center">
                    <template v-slot:default="categoryTag">
                        <el-tag :type="categoryTag.row.type === 'category' ? '' : 'success'">
                            {{categoryTag.row.type ==="category" ? "分类" : "标签"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="描述" width="400px" header-align="center" align="center">
                    <template v-slot:default="categoryTag">
                        <span class="table-column-cell">{{ categoryTag.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="使用数量" header-align="center">
                    <template v-slot:default="categoryTag">
                        <span class="table-column-cell">{{ categoryTag.row.count }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="categoryTag">
                        <el-button type="text" size="small" v-if="categoryTag.row.name !== '默认分类'" @click="handleEdit(categoryTag.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(categoryTag.row)">删除</el-button>
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
                <el-form-item label="名称:">
                    <el-input autocomplete="off" style="width: 300px;" v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="类型:">
                    <el-select v-model="type" style="width: 300px;">
                        <el-option label="分类" value="category"></el-option>
                        <el-option label="标签" value="tag"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述:">
                    <el-input style="width: 300px;" type="textarea" :rows="4" v-model="description"></el-input>
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
            mid: '',
            name: "",
            type: "category",
            description: "",
            loading: false,
            total: 0,
            categoryTagList: [],
            dialogFormVisible: false,
            delVisible: false,
            slug: '',
            delParams: {},
            page: 1,
            pageSize: 10
        }
    },
    created: function() {
        this.loading = true
        this.handleCurrentPageChange(1);
    },
    methods: {
        submitDelete() {
            this.loading = true
            let params = {
                "mid": this.delParams.mid
            }
            this.$axios.delete(this.HOST + `/admin/api/delMeta?${stringify(params)}`)
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
        handleDelete(params) {
            this.delVisible = true
            this.delParams = params
        },
        handleEdit(params) {
            this.mid = params.mid
            this.dialogFormVisible = true
            this.name = params.name
            this.type = params.type
            this.description = params.description
        },
        handleCurrentPageChange: function(val) {
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/categoryTagList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.categoryTagList = resp.list,
                    this.page = val
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        submit() {
            this.loading = true
            let params = {
                mid: this.mid,
                name: this.name,
                type: this.type,
                description: this.description,
                slug: this.slug
            }
            this.$axios.post(this.HOST + "/admin/api/addOrUpdateMeta", {
                ...params
            }).then(response => {
                if (response.data.code === 0) {
                    this.dialogFormVisible = false
                    this.handleCurrentPageChange(this.page)
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        closeDialog() {
            this.dialogFormVisible = false
            this.mid = ''
            this.name = ''
            this.type = 'category'
            this.description = ''
        }
    }
}
</script>

