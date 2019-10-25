<template>
  <div v-loading="loading">
    <el-form :model="page_form">
      <el-card class="page-header">
        <span>自定义页面编辑</span>
      </el-card>
      <el-card>
        <el-form-item prop="title">
          <el-input placeholder="输入标题" v-model="page_form.title" class="page-title"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <markdownEdit
            :key="page_form.id"
            :val="page_form.content"
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
      page_form: {
        content: "",
        title: ""
      }
    };
  },
  components: {
    markdownEdit
  },
  created: function() {
    const id = this.$route.query.id;
    if (id && id !== 0) {
      this.loading = true;
      this.$axios
        .get(this.HOST + "/admin/custom/page/info/" + id)
        .then(resp => {
          if (resp.data.success) {
            this.page_form = resp.data.data;
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
      this.page_form.content = val;
    },
    async submit(status) {
      if (this.page_form.title.trim() === "") {
        this.$message.warning("请输入标题");
        return;
      }
      if (this.page_form.content.trim() === "") {
        this.$message.warning("请输入内容");
        return;
      }

      this.page_form.status = status;
      try {
        this.loading = true;
        let resp;
        if (this.page_form.id && this.page_form.id !== "0") {
          delete this.page_form.create_time;
          delete this.page_form.modify_time;
          resp = await this.$axios.put(
            this.HOST + "/admin/custom/page/update",
            {
              ...this.page_form
            }
          );
        } else {
          resp = await this.$axios.post(this.HOST + "/admin/custom/page/add", {
            ...this.page_form
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
    }
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