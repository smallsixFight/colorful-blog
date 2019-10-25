<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>我的文章</span>
    </el-card>
    <el-card>
      <el-table :data="article_list" style="width: 100%; font-size:16px;">
        <el-table-column align="center" label="标题" width="400px">
          <template v-slot:default="article">
            <span class="table-column-cell">{{ article.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" align="center" label="创建日期"></el-table-column>
        <el-table-column prop="modify_time" align="center" label="最近修改日期"></el-table-column>
        <el-table-column align="center" label="浏览量">
          <template v-slot:default="article">
            <span class="table-column-cell">{{ article.row.hits }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot:default="article">
            <el-tag
              :type="article.row.status ? 'success' : 'warning'"
            >{{article.row.status ? "已发布" : "草稿"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="article">
            <el-button type="text" size="small" @click="handleEdit(article.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(article.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="table-pagination"
        layout="->, prev, pager, next"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentPageChange"
      ></el-pagination>
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
import { stringify } from "qs";
export default {
  data() {
    return {
      del_visible: false,
      loading: false,
      page: 1,
      page_size: 10,
      total: 0,
      article_list: []
    };
  },
  created: function() {
    this.handleCurrentPageChange(1);
  },
  methods: {
    handleEdit(id) {
      this.$router.push({ path: "/admin/articleEdit", query: { id: id } });
    },
    submitDelete() {
      this.loading = true;
      this.$axios
        .delete(this.HOST + `/admin/article/del/` + this.delParams.id)
        .then(response => {
          if (response.data.code === 0) {
            this.del_visible = false;
            this.$message.success(response.data.message);
            this.handleCurrentPageChange(this.page);
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleDelete(params) {
      this.del_visible = true;
      this.delParams = params;
    },
    closeDelDialog() {
      this.del_visible = false;
      this.delParams = {};
    },
    handleCurrentPageChange: function(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/admin/article/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            this.article_list = resp.data;
            this.page = val;
          } else {
            this.$message.error(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

