<template>
  <div v-loading="loading">
    <el-form :model="pageForm">
      <el-card class="page-header">
        <span>自定义页面编辑</span>
      </el-card>
      <el-card>
        <el-form-item prop="title">
          <el-input placeholder="输入标题" v-model="pageForm.title" class="page-title"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <markdownEdit
            :key="pageForm.id"
            :val="pageForm.content"
            v-on:change="handleContentChange"
          ></markdownEdit>
        </el-form-item>
        <el-form-item>
          <div style="float: right;">
            <el-button class="editor-btn" size="small" type="warning" @click="submit(0)">存为草稿</el-button>
            <el-button class="editor-btn" size="small" type="primary" @click="submit(1)">发布</el-button>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import markdownEdit from "../components/MarkdownEdit";
export default {
  name: "PageEdit",
  data() {
    return {
      loading: false,
      pageForm: {
        content: "",
        title: "",
      },
    };
  },
  components: {
    markdownEdit,
  },
  created: function() {
    const id = this.$route.query.id;
    if (id && id !== 0) {
      this.loading = true;
      this.$axios
        .get(this.HOST + "/admin/custom/page/info/" + id)
        .then(resp => {
          if (resp.data.success) {
            this.pageForm = resp.data.data;
          } else {
            this.$message.warning(resp.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  methods: {
      handleContentChange(val) {
      this.pageForm.content = val;
    },
    async submit(status) {
    if (this.pageForm.title.trim() === "") {
        this.$message.warning("请输入标题");
        return;
      }
      if (this.pageForm.content.trim() === "") {
        this.$message.warning("请输入内容");
        return;
      }

      this.pageForm.status = status;
      try {
        this.loading = true;
        let resp;
        if (this.pageForm.id && this.pageForm.id !== '0') {
          delete this.pageForm.create_time;
          delete this.pageForm.modify_time;
          resp = await this.$axios.put(this.HOST + "/admin/custom/page/update", {
            ...this.pageForm
          });
        } else {
          resp = await this.$axios.post(this.HOST + "/admin/custom/page/add", {
            ...this.pageForm
          });
        }
        if (resp.data.success) {
          this.$message.success(resp.data.message);
          this.$router.replace("/admin/pageList");
        } else {
          this.$message.warning(resp.data.message);
        }
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
.editor-btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
.page-title {
  margin-top: 10px;
  margin-bottom: 16px;
}
</style>