<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>书籍列表</span>
      <el-divider></el-divider>
      <el-autocomplete
        class="search"
        v-model="search_key"
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索书籍（作者、书名、ISBN）"
      >
        <template slot-scope="{ item }">
          <div>
            <img :src="item.pic" style="width: 60px" />
            <div style="display: inline-block; margin-left: 12px; vertical-align: top">
              <span style="font-size: 18px">{{ item.title }}</span>&nbsp;&nbsp;
              <span style="font-size: 16px">{{item.year}}</span>
              <p style="font-size: 18px">{{ item.author_name }}</p>
            </div>
            <el-button style="float: right; margin-top: 20px" @click="handleAddInfo(item)">添加</el-button>
          </div>
        </template>
      </el-autocomplete>
    </el-card>
    <el-card>
      <el-table :data="list" style="width: 100%; font-size:16px;">
        <el-table-column align="center" label="书名">
          <template v-slot:default="book_info">
            <!-- <img style="max-height: 60%" :src="book_info.row.pic_url" /> -->
            <span class="table-column-cell">{{ book_info.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出版年份">
          <template v-slot:default="book_info">
            <span class="table-column-cell">{{ book_info.row.year }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="作者" width="400px">
          <template v-slot:default="book_info">
            <span class="table-column-cell">{{ book_info.row.author_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot:default="book_info">
            <el-tag
              :type="book_info.row.status === '读过' ? 'success' : 'warning'"
            >{{ book_info.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="豆瓣链接">
          <template v-slot:default="book_info">
            <a target="_blank" :href="book_info.row.douban_url">点击前往</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最近修改时间">
          <template v-slot:default="book_info">
            <span class="table-column-cell">{{ book_info.row.modify_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="book_info">
            <el-button type="text" size="small" @click="handleEdit(book_info.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(book_info.row)">删除</el-button>
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
        <el-button @click="closeDelDialog" size="small" :loading="loading">取 消</el-button>
        <el-button type="primary" @click="delBookInfo" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="edit_visible" title="编辑" width="700px" @closed="closeEditDialog">
      <div>
        <el-form label-position="right" label-width="100px" :model="edit_info">
          <el-form-item label="书 名">
            <el-input readonly autocomplete="off" style="width: 500px;" v-model="edit_info.title"></el-input>
          </el-form-item>
          <el-form-item label="作 者">
            <el-input
              readonly
              autocomplete="off"
              style="width: 500px;"
              v-model="edit_info.author_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版日期">
            <el-input readonly autocomplete="off" style="width: 500px;" v-model="edit_info.year"></el-input>
          </el-form-item>
          <el-form-item label="状 态">
            <el-select v-model="edit_info.status" style="width: 500px;">
              <el-option label="想读" value="想读"></el-option>
              <el-option label="读过" value="读过"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简 介">
            <el-input type="textarea" id="textarea" :rows="6" v-model="edit_info.summary"></el-input>
          </el-form-item>
          <el-form-item label="读后感/简评">
            <el-input id="textarea" type="textarea" :rows="6" v-model="edit_info.short_comment"></el-input>
          </el-form-item>
          <div style="text-align: center;">
            <el-button type="primary" @click="submit" size="small" :loading="loading">保存</el-button>
            <el-button @click="closeEditDialog" size="small" :loading="loading">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.search {
  display: block;
  margin: 0 auto;
  width: 60%;
}
#textarea {
  width: 500px;
  overflow-x: scroll;
  overflow-y: scroll;
  box-sizing: border-box;
}

#textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
#textarea::-webkit-scrollbar-thumb {
  height: 40px;
  background-color: #aaa;
  border-radius: 16px;
}
#textarea::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
</style>
<script>
import { stringify } from "qs";
export default {
  data() {
    return {
      search_key: "",
      loading: false,
      page: 1,
      page_size: 10,
      total: 0,
      list: [],
      search_list: [],
      edit_info: {},
      del_info: null,
      edit_visible: false,
      del_visible: false,
      timeOutEvent: null
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      delete this.edit_info.create_time;
      delete this.edit_info.modify_time;
      this.$axios
        .put(this.HOST + `/admin/book/info/update`, { ...this.edit_info })
        .then(resp => {
          if (resp.data.success) {
            this.$message.success(resp.data.message);
            this.handleEdit();
            this.handleCurrentPageChange(this.page);
          } else {
            this.$message.warn(resp.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async handleAddInfo(param) {
      this.loading = true;
      try {
        const response = await this.$axios.post(
          this.HOST + "/admin/book/info/add",
          { ...param }
        );
        const resp = response.data;
        if (resp.success) {
          this.handleCurrentPageChange(this.page);
          this.$message.success(resp.message);
        } else {
          this.$message.error(resp.message);
        }
      } finally {
        this.loading = false;
      }
    },
    handleDelete(params) {
      this.del_visible = !this.del_visible;
      this.del_info = params;
    },
    async delBookInfo() {
      this.loading = true;
      try {
        const resp = await this.$axios.delete(
          this.HOST + `/admin/book/info/del/` + this.del_info.id
        );
        if (resp.data.success) {
          this.$message.success(resp.data.message);
          const p = this.page - 1;
          if (p * this.page_size + 1 >= this.total) {
            this.page = p;
          }
          this.handleDelete();
          this.handleCurrentPageChange(this.page);
        } else {
          this.$message.error(resp.message);
        }
      } finally {
        this.loading = false;
      }
    },
    querySearchAsync(key, callback) {
      if (!key || !key.toString().trim()) {
        clearTimeout(this.timeOutEvent);
        callback(this.search_list);
        return;
      }
      // this.$axios
      //   .get(this.HOST + `/admin/book/info/search?key=` + key)
      //   .then(response => {
      //     if (response.data.success) {
      //       this.search_list = response.data.data;
      //     } else {
      //       this.search_list = [];
      //       this.$message.error(response.data.message);
      //     }
      //     callback(this.search_list);
      //   });
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = setTimeout(() => {
        this.$axios
          .get(this.HOST + `/admin/book/info/search?key=` + key)
          .then(response => {
            if (response.data.success) {
              this.search_list = response.data.data;
            } else {
              this.search_list = [];
              this.$message.error(response.data.message);
            }
            callback(this.search_list);
          });
      }, 2000);
    },
    handleCurrentPageChange(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/admin/book/info/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            this.list = resp.data;
            for (let idx in this.list) {
              this.list[idx].summary = this.list[idx].summary.replace(
                /\\n/g,
                "\n"
              );
              this.list[idx].short_comment = this.list[
                idx
              ].short_comment.replace(/\\n/g, "\n");
            }
            this.page = val;
          } else {
            this.$message.error(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(params) {
      this.edit_info = params ? { ...params } : {};
      this.edit_visible = !this.edit_visible;
    },
    closeDelDialog() {
      this.del_info = {};
      this.del_visible = false;
    },
    closeEditDialog() {
      this.edit_info = {};
      this.edit_visible = false;
    }
  },
  created: function() {
    this.handleCurrentPageChange(1);
  }
};
</script>