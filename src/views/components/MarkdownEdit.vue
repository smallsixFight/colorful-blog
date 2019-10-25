<template>
  <div style="height: 100%">
    <el-button style="margin-bottom: 14px; float: right;" type="primary" @click="handlePreview">预览</el-button>
    <el-input
      type="textarea"
      v-model="content"
      @change="handleChange"
      :autosize="{ minRows: 30, maxRows: 40}"
      placeholder="请输入内容"
    ></el-input>
    <el-dialog
      class="content"
      :destroy-on-close="true"
      :visible.sync="previewVisible"
      title="预览"
      @closed="closePreDialog"
    >
      <div class="content" style="height:600px; border: solid 1px #ccc; border-radius: 4px;">
        <div style="padding: 18px;" v-html="html_content"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let marked = require("marked");
export default {
  name: "markdownEdit",
  props: ["val"],

  data() {
    return {
      content: this.val,
      previewVisible: false,
      html_content: ""
    };
  },
  methods: {
    handleChange() {
      this.$emit("change", this.content);
    },
    closePreDialog() {
      this.previewVisible = false;
    },
    handlePreview() {
      this.html_content = marked(this.content);
      this.previewVisible = true;
    }
  }
};
</script>