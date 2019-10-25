<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>友链管理</span>
    </el-card>
    <el-card>
      <el-button type="primary" size="small" @click="dialog_form_visible = true">新增</el-button>
      <el-table :data="link_list" style="width: 100%;font-size:14px;">
        <el-table-column label="URL" align="center">
          <template v-slot:default="link">
            <span class="table-column-cell">{{ link.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所有者" align="center">
          <template v-slot:default="link">
            <span class="table-column-cell">{{ link.row.owner }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template v-slot:default="link">
            <span class="table-column-cell">{{ link.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot:default="link">
            <el-tag
              :type="link.row.status ? 'success' : 'warning'"
            >{{ link.row.status ? "发布" : "待发布" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建日期">
          <template v-slot:default="link">
            <span class="table-column-cell">{{ link.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最新修改日期">
          <template v-slot:default="link">
            <span class="table-column-cell">{{ link.row.modify_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="link">
            <el-button type="text" size="small" @click="handleEdit(link.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(link.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialog_form_visible" title="编辑" width="420px" @closed="closeDialog">
      <el-form>
        <el-form-item label="名 称">
          <el-input autocomplete="off" style="width: 300px;" v-model="url"></el-input>
        </el-form-item>
        <el-form-item label="主 人">
          <el-input autocomplete="off" style="width: 300px;" v-model="owner"></el-input>
        </el-form-item>
        <el-form-item label="状 态">
          <el-select v-model="status" style="width: 300px;">
            <el-option label="发布" :value="true"></el-option>
            <el-option label="待发布" :value="false"></el-option>
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
      url: "",
      page: 1,
      page_size: 10,
      owner: "",
      description: "",
      status: false,
      total: 0,
      link_list: [],
      loading: false,
      dialog_form_visible: false,
      del_visible: false,
      del_params: {}
    };
  },
  created: function() {
    this.handleCurrentPageChange(1);
  },
  methods: {
    handleDelete(params) {
      this.del_visible = true;
      this.del_params = params;
    },
    submitDelete() {
      this.loading = true;
      this.$axios
        .delete(this.HOST + `/admin/link/del/` + this.del_params.id)
        .then(response => {
          if (response.data.success) {
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
    closeDelDialog() {
      this.del_visible = false;
      this.del_params = {};
    },
    handleEdit(params) {
      this.id = params.id;
      this.url = params.url;
      this.owner = params.owner;
      this.status = params.status;
      this.description = params.description;
      this.dialog_form_visible = true;
    },
    submit() {
      let params = {
        id: this.id,
        url: this.url,
        owner: this.owner,
        status: this.status,
        description: this.description
      };
      if (!params.id || params.id === "0") {
        this.$axios
          .post(this.HOST + "/admin/link/add", {
            ...params
          })
          .then(response => {
            if (response.data.success) {
              this.dialog_form_visible = false;
              this.$message.success(response.data.message);
              this.handleCurrentPageChange(this.page);
            } else {
              this.$message.warning(response.data.message);
            }
          });
      } else {
        this.$axios
          .put(this.HOST + "/admin/link/update", {
            ...params
          })
          .then(response => {
            if (response.data.success) {
              this.dialog_form_visible = false;
              this.$message.success(response.data.message);
              this.handleCurrentPageChange(this.page);
            } else {
              this.$message.warning(response.data.message);
            }
          });
      }
    },
    closeDialog() {
      this.id = "0";
      this.url = "";
      this.owner = "";
      this.status = false;
      this.description = "";
      this.dialog_form_visible = false;
    },
    handleCurrentPageChange: function(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/admin/link/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            (this.link_list = resp.data), (this.page = val);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

