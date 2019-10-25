<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>系统日志</span>
    </el-card>
    <el-card>
      <el-table :data="log_list" style="width: 100%;font-size:14px;">
        <el-table-column prop="action" align="center" label="事件"></el-table-column>
        <el-table-column prop="result" align="center" label="结果"></el-table-column>
        <el-table-column prop="operator" align="center" label="操作者"></el-table-column>
        <el-table-column prop="ip" align="center" label="IP"></el-table-column>
        <el-table-column prop="create_time" align="center" label="时间"></el-table-column>
      </el-table>
      <el-pagination
        class="table-pagination"
        layout="->, prev, pager, next"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentPageChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { stringify } from "qs";
export default {
  data() {
    return {
      page: 1,
      page_size: 10,
      loading: false,
      log_list: [],
      total: 0
    };
  },
  created: function() {
    this.handleCurrentPageChange(1);
  },
  methods: {
    handleCurrentPageChange: function(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/admin/sys/log/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            this.log_list = resp.data;
            this.page = val;
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

