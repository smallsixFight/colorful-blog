<template>
  <div v-loading="loading">
    <el-card class="page-header">
      <span>七牛云存储管理</span>
    </el-card>
    <el-card>
      <el-button
        size="small"
        @click="changeUploadFrameVisible"
        type="primary"
        style="margin-bottom: 10px;"
      >上传</el-button>
      <el-button
        size="small"
        @click="syncAttachInfo"
        type="primary"
        style="margin-bottom: 10px;"
      >同步数据</el-button>
      <el-upload
        v-if="uploadFrame_visible"
        class="upload-frame"
        :show-file-list="false"
        drag
        accept=".jpg, .jpeg, .png"
        :http-request="upload"
        action
        :before-upload="beforeUpload"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <el-table :data="attachment_list" style="width: 100%; font-size:14px; margin-top: 10px;">
        <el-table-column align="center" label="名称" header-align="center">
          <template v-slot:default="attachment">
            <span class="table-column-cell">{{ attachment.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="类型" header-align="center"></el-table-column>
        <el-table-column align="center" label="上传时间" header-align="center">
          <template v-slot:default="attachment">
            <span class="table-column-cell">{{ attachment.row.upload_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" align="center" label="大小" header-align="center">
          <template v-slot:default="attachment">
            <span
              class="table-column-cell"
            >{{ parseFloat(attachment.row.size / 1024 / 1024).toFixed(3) }} MB</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" header-align="center">
          <template v-slot:default="attachment">
            <el-button
              v-if="attachment.row.type.substring(0, 5) === 'image'"
              type="text"
              size="small"
              @click="handlePreview(attachment.row)"
            >在线查看</el-button>
            <el-button type="text" size="small" @click="downloadFile(attachment.row)">下载</el-button>
            <el-button type="text" size="small" @click="handleDelete(attachment.row.id)">删除</el-button>
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
        <el-button type="primary" @click="submitDelete" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="preview_visible" width="26%" @closed="closePreviewDialog">
      <img style="width: 100%;" :src="preview_imgPath" />
    </el-dialog>
  </div>
</template>

<script>
import { stringify } from "qs";
export default {
  data() {
    return {
      loading: false,
      uploadFrame_visible: false,
      attachment_list: [],
      page: 1,
      page_size: 10,
      total: 0,
      del_visible: false,
      delId: null,
      preview_visible: false,
      preview_imgPath: "",
      upload_file: {}
    };
  },
  created: function() {
    this.handleCurrentPageChange(1);
  },
  methods: {
    // 从七牛云同步存储数据
    syncAttachInfo() {
      this.loading = true;
      this.$axios
        .get(this.HOST + "/admin/attach/sync")
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
          } else {
            this.$message.success(response.data.message);
          }
        })
        .finally(() => {
          this.handleCurrentPageChange(1);
        });
    },
    upload(params) {
      this.loading = true;
      this.upload_file = params.file;
      this.$axios
        .get(this.HOST + "/admin/attach/cert")
        .then(response => {
          if (!response.data.success) {
            throw response.data;
          }
          return response.data.data;
        })
        .then(upParam => {
          let formData = new FormData();
          formData.append("key", this.upload_file.name);
          formData.append("token", upParam.up_token);
          formData.append("file", this.upload_file);
          formData.append("up_url", upParam.up_url);
          return formData;
        })
        .then(formData => {
          return this.$axios.post(formData.get("up_url"), formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
        })
        .then(resp => {
          // 保存上传成功文件信息
          if (resp.status === 200) {
            let fileInfo = {
              name: this.upload_file.name,
              size: this.upload_file.size,
              type: this.upload_file.type
            };
            return this.$axios.post(this.HOST + "/admin/attach/save", {
              ...fileInfo
            });
          }
        })
        .then(saveInfoResp => {
          if (saveInfoResp.data.success) {
            this.$message.success(saveInfoResp.data.message);
            this.handleCurrentPageChange(this.page);
          } else {
            throw saveInfoResp.data;
          }
        })
        .catch(err => {
          this.$message.warning(err.message);
        })
        .finally(() => {
          this.loading = false;
          this.upload_file = {};
        });
    },
    handlePreview(fileInfo) {
      this.loading = true;
      this.preview_visible = true;
      this.preview_imgPath = fileInfo.path;
      this.loading = false;
    },
    handleDelete(id) {
      this.del_visible = true;
      this.delId = id;
    },
    closePreviewDialog() {
      this.preview_visible = false;
      this.preview_imgPath = "";
    },
    closeDelDialog() {
      this.del_visible = false;
      this.delId = null;
    },
    submitDelete() {
      this.loading = true;
      this.$axios
        .delete(this.HOST + `/admin/attach/del/` + this.delId)
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
            const p = this.page - 1;
            if (this.page * this.page_size + 1 >= this.total) {
              this.page = p;
            }
            this.handleCurrentPageChange(this.page);
          } else {
            this.$message.warning(response.data.message);
          }
          this.del_visible = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    download(resp, fileName) {
      if (!resp.data) return;
      let url = window.URL.createObjectURL(new Blob([resp.data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", resp.headers.filename || fileName);

      document.body.appendChild(link);
      link.click();
    },
    downloadFile(fileInfo) {
      this.$axios({
        method: "get",
        url: fileInfo.path,
        responseType: "blob"
      }).then(response => {
        this.download(response, fileInfo.name);
      });
    },
    handleCurrentPageChange(val) {
      this.loading = true;
      let queryData = {
        page: val,
        page_size: this.page_size
      };
      this.$axios
        .get(this.HOST + `/admin/attach/list?${stringify(queryData)}`)
        .then(response => {
          if (response.data.success) {
            let resp = response.data;
            this.total = resp.total;
            (this.attachment_list = resp.data), (this.page = val);
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 2) {
        this.$message.warning("上传文件大小不能大于 2 M！");
        return false;
      }
    },
    changeUploadFrameVisible() {
      this.uploadFrame_visible = !this.uploadFrame_visible;
    }
  }
};
</script>

<style scope>
.upload-frame {
  width: 100%;
}
.upload-frame .el-upload {
  width: 100%;
}
.upload-frame .el-upload .el-upload-dragger {
  width: 100%;
}
</style>
