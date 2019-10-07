<template>
  <div v-loading="loading">
    <el-form :model="article_form">
      <el-card class="page-header">
        <span>文章编辑</span>
      </el-card>
      <el-card>
        <div class="article-select">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="分类">
                <metaList
                  type="2"
                  :key="article_form.article.id"
                  :defaultVal="article_form.category"
                  v-on:change="handleCatoryChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签">
                <metaList
                  type="1"
                  :key="article_form.article.id"
                  :defaultVal="article_form.tag_list"
                  :multiple="true"
                  v-on:change="handleTagsChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开启评论">
                <el-select v-model="article_form.article.allow_comment" size="small">
                  <el-option :key="true" :value="true" label="是"></el-option>
                  <el-option :key="false" :value="false" label="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item prop="title">
          <el-input placeholder="输入文章标题" v-model="article_form.article.title" class="article-title"></el-input>
        </el-form-item>
        <el-form-item prop="content">
          <markdownEdit
            :key="article_form.article.id"
            :val="article_form.article.content"
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
import metaList from "../components/LookupMeta";
export default {
  name: "articleEdit",
  data() {
    return {
      loading: false,
      article_form: {
        article: {
          content: "",
          title: "",
          allow_comment: true
        },
        category: "",
        tag_list: []
      },
    };
  },
  components: {
    markdownEdit,
    metaList
  },
  created: function() {
    const id = this.$route.query.id;
    if (id && id !== 0) {
      this.loading = true;
      this.$axios
        .get(this.HOST + "/admin/article/info/" + id)
        .then(resp => {
          if (resp.data.success) {
            this.article_form = resp.data.data;
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
      this.article_form.article.content = val;
    },
    handleCatoryChange(val) {
      this.article_form.category = val;
    },
    handleTagsChange(val) {
      this.article_form.tag_list = val;
    },

    // 更新或新增文章
    async submit(status) {
      if (this.article_form.article.title.trim() === "") {
        this.$message.warning("请输入标题");
        return;
      }
      if (this.article_form.article.content.trim() === "") {
        this.$message.warning("请输入内容");
        return;
      }
      if (this.article_form.category === "") {
        this.$message.warning("请至少选择一个分类");
        return;
      }

      this.article_form.article.status = status;
      try {
        this.loading = true;
        let resp;
        if (this.article_form.article.id && this.article_form.article.id !== '0') {
          delete this.article_form.article.create_time;
          delete this.article_form.article.modify_time;
          resp = await this.$axios.put(this.HOST + "/admin/article/update", {
            ...this.article_form
          });
        } else {
          resp = await this.$axios.post(this.HOST + "/admin/article/add", {
            ...this.article_form
          });
        }
        if (resp.data.success) {
          this.$message.success(resp.data.message);
          this.$router.replace("/admin/articleList");
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
.article-select {
  margin-top: 10px;
  margin-bottom: 10px;
}
.article-title {
  margin-top: 10px;
  margin-bottom: 16px;
}
</style>