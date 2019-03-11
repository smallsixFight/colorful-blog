<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>系统日志</span>
        </el-card>
        <el-card>
            <el-table :data="logList" style="width: 100%;font-size:14px;">
                <el-table-column prop="action" align="center" label="事件" header-align="center">
                </el-table-column>
                <el-table-column prop="result" align="center" label="结果" header-align="center">
                </el-table-column>
                <el-table-column prop="username" align="center" label="操作者" header-align="center">
                </el-table-column>
                <el-table-column prop="ip" align="center" label="IP" header-align="center">
                </el-table-column>
                <el-table-column align="center" label="时间" header-align="center">
                    <template v-slot:default="log">
                        <span class="table-column-cell">{{ log.row.created | unixTimeFormat }}</span>
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
    </div>
</template>

<script>
import { stringify } from 'qs'
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            loading: false,
            logList: [],
            total: 0
        }
    },
    created: function() {
        this.handleCurrentPageChange(1);
    },
    methods: {
        handleCurrentPageChange: function(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/logList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.logList = resp.list,
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

