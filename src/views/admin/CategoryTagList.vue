<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>分类 / 标签</span>
    </el-card>
    <el-card>
      <el-button type="primary" size="small" @click="dialogFormVisible = true">新增</el-button>
      <el-table :data="category_tag_list" style="width: 100%;font-size:14px;">
        <el-table-column label="名称" header-align="center" align="center">
          <template v-slot:default="categor_tag">
            <span class="table-column-cell">{{ categor_tag.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" header-align="center" align="center">
          <template v-slot:default="categor_tag">
            <el-tag
              :type="categor_tag.row.type === 2 ? '' : 'success'"
            >{{categor_tag.row.type === 2 ? "分类" : "标签"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="400px" header-align="center" align="center">
          <template v-slot:default="categor_tag">
            <span class="table-column-cell">{{ categor_tag.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用数量" header-align="center">
          <template v-slot:default="categor_tag">
            <span class="table-column-cell">{{ categor_tag.row.use_count }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" header-align="center">
          <template v-slot:default="categor_tag">
            <el-button
              type="text"
              size="small"
              v-if="categor_tag.row.name !== '默认分类'"
              @click="handleEdit(categor_tag.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              v-if="categor_tag.row.name !== '默认分类'"
              @click="handleDelete(categor_tag.row)"
            >删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" title="新增" width="420px" @closed="closeDialog">
      <el-form>
        <el-form-item label="名称:">
          <el-input autocomplete="off" style="width: 300px;" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model.number='type' style="width: 300px;">
            <el-option label="分类" :value=2></el-option>
            <el-option label="标签" :value=1></el-option>
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
import { stringify } from "qs";
export default {
  data() {
    return {
      id: "0",
      name: "",
      type: 2,
      description: "",
      loading: false,
      total: 0,
      category_tag_list: [],
      dialogFormVisible: false,
      delVisible: false,
      delParams: {},
      page: 1,
      pageSize: 10
    };
  },
  created: function() {
    this.loading = true;
    this.handleCurrentPageChange(1);
  },
  methods: {
    submitDelete() {
      this.loading = true;
      this.$axios
        .delete(this.HOST + `/admin/category_tag/del/` + this.delParams.id)
        .then(response => {
          if (response.data.success) {
            this.delVisible = false;
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
      this.delVisible = false;
      this.delParams = {};
    },
    handleDelete(params) {
      this.delVisible = true;
      this.delParams = params;
    },
    handleEdit(params) {
      this.id = params.id;
      this.dialogFormVisible = true;
      this.name = params.name;
      this.type = params.type;
      this.description = params.description;
    },
    handleCurrentPageChange: function(val) {
      let queryData = {
        page: val,
        pageSize: this.pageSize
      };
      this.$axios
        .get(this.HOST + `/admin/category_tag/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            this.category_tag_list = resp.data;
            this.page = val;
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      let params = {
        id: this.id,
        name: this.name,
        type: this.type,
        description: this.description,
      };
      if (params.id === '0') {
          this.$axios.post(this.HOST + "/admin/category_tag/add", {
            ...params
        }).then(response => {
            if (response.data.success) {
              this.dialogFormVisible = false;
              this.$message.success(response.data.message);
              this.handleCurrentPageChange(this.page);
            } else {
              this.$message.warning(response.data.message);
            }
        }).finally(() => {
            this.loading = false;
        });
      } else {
        this.$axios.put(this.HOST + "/admin/category_tag/update", {
            ...params
        }).then(response => {
            if (response.data.success) {
              this.dialogFormVisible = false;
              this.$message.success(response.data.message);
              this.handleCurrentPageChange(this.page);
            } else {
              this.$message.warning(response.data.message);
            }
        }).finally(() => {
            this.loading = false;
        });
      }
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.id = "0";
      this.name = "";
      this.type = 2;
      this.description = "";
    }
  }
};
</script>

