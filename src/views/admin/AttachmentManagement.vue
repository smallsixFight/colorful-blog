<template>
    <div v-loading="loading">
        <el-card class="page-header">
            <span>附件管理</span>
        </el-card>
        <el-card>
            <el-button size="small" @click="changeUploadFrameVisible" type="primary" style="margin-bottom: 10px;">上传</el-button>
            <el-upload
                v-if="uploadFrameVisible"
                class="upload-frame"
                :show-file-list="false"
                drag
                accept=".jpg, .jpeg, .png"
                :http-request="uploadFile"
                action=""
                :before-upload="beforeUpload"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或 <em> 点击上传</em></div>
            </el-upload>
            <el-table :data="attachmentList" style="width: 100%; font-size:14px; margin-top: 10px;">
                <el-table-column align="center" label="名称" header-align="center">
                    <template v-slot:default="attachment">
                        <span class="table-column-cell">{{ attachment.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" align="center" label="类型" header-align="center">
                </el-table-column>
                <el-table-column align="center" label="保存位置" header-align="center">
                    <template v-slot:default="attachment">
                        <span class="table-column-cell">{{ attachment.row.place == 'local' ? "本地" : '七牛云' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上传时间" header-align="center">
                    <template v-slot:default="attachment">
                        <span class="table-column-cell">{{ attachment.row.created | unixTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" align="center" label="大小" header-align="center">
                    <template v-slot:default="attachment">
                        <span class="table-column-cell">{{ parseFloat(attachment.row.size / 1024 / 1024).toFixed(3) }} MB</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" header-align="center">
                    <template v-slot:default="attachment">
                        <el-button type="text" size="small" @click="handlePreview(attachment.row)">在线查看</el-button>
                        <el-button type="text" size="small" @click="downloadFile(attachment.row)">下载</el-button>
                        <el-button type="text" size="small" @click="handleDelete(attachment.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="table-pagination"
                layout="->, prev, pager, next"
                :total="total" 
                :current-page.sync="page"
                @current-change="handleCurrentPageChange">
            </el-pagination>
        </el-card>
        <el-dialog :visible.sync="delVisible" title="删除" width="20%" @closed="closeDelDialog">
            <span>确定删除吗？</span>
            <span slot="footer">
                <el-button @click="closeDelDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="submitDelete" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="previewVisible" width="26%" @closed="closePreviewDialog">
            <img style="width: 100%;" :src="previewImgPath" />
        </el-dialog>
    </div>
</template>

<script>
import { stringify } from 'qs'
import * as qiniu from 'qiniu-js'
export default {
    data() {
        return {
            loading: false,
            uploadFrameVisible: false,
            attachmentList: [],
            page: 1,
            pageSize: 10,
            total: 0,
            delVisible: false,
            delId: null,
            previewVisible: false,
            previewImgPath : '',
            uploadQiNiuFile: {}
        }
    },
    created: function() {
        this.handleCurrentPageChange(1);
    },
    methods: {
        uploadToQiNiu(fileObject) {
            this.uploadQiNiuFile = fileObject
            this.$axios.get(this.HOST + "/admin/api/getUpToken")
            .then(response => {
                if (response.data.code !== 0) {
                    this.$message.warning("获取上传凭证失败！")
                    return
                }
                return response.data.data
            }).then(result => {
                const key = fileObject.name
                const token = result
                const putExtra = {
                    fname: "",
                    params: {},
                    mimeType: [] || null
                }
                const config = {
                    useCdnDomain: true,
                    region: qiniu.region.z0,
                }
                let observable = qiniu.upload(fileObject, key, token, putExtra, config);
                observable.subscribe(this.next, this.uploadQiNiuError)
            })
        },
        saveQiNiuFileInfo() {
            this.$axios.post(this.HOST + "/admin/api/saveQiNiuFileInfo", {
                name: this.uploadQiNiuFile.name,
                size: this.uploadQiNiuFile.size,
                type: this.uploadQiNiuFile.type
            }).then(response => {
                if (response.data.code === 0) {
                    this.handleCurrentPageChange(this.page)
                    this.$message.success(response.data.message)
                } else if (response.data.code === 1) {
                    this.handleCurrentPageChange(this.page)
                    this.$message.warning(response.data.message)
                } else
                    this.$message.error(response.data.message)
            }).finally( () => {
                this.loading = false
                this.uploadQiNiuFile = {}
            })
        },
        next(response) {
            if (response.total.percent === 100) {
                this.saveQiNiuFileInfo()
            }
        },
        uploadQiNiuError(err) {
            this.$message.error(err.message)
        },
        uploadToServer(fileObject) {
            let formData = new FormData();
            formData.append("file", fileObject);
            this.$axios.post(this.HOST + "/admin/api/upload", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => {
                if (response.data.code === 0) {
                    this.$message.success(response.data.message)
                    this.handleCurrentPageChange(this.page)
                } else 
                    this.$message.warning(response.data.message)
            }).finally( () => {
                this.loading = false
            })
        },
        uploadFile(params) {
            this.loading = true
            let fileObject = params.file;
            this.$axios.get(this.HOST + "/admin/api/getUploadLocation")
            .then(response => {
                if (response.data.code !== 0) {
                    this.$message.error(response.data.message)
                }
                return response.data.data
            }).then(result => {
                if (result === "local") {
                    this.uploadToServer(fileObject)
                } else {
                    this.uploadToQiNiu(fileObject)
                }
            })
            
        },
        handlePreview(params) {
            this.loading = true
            if (params.place === "qiNiu") {
                this.previewVisible = true
                this.previewImgPath = params.path;
                this.loading = false
                return
            }
            let queryData = {
                fileName: params.path
            }
            this.$axios({
                method: 'post',
                url: this.HOST + `/admin/api/downloadFile?${stringify(queryData)}`,
                responseType: 'blob'
            }).then(response => {
                let that = this
                let reader = new FileReader();
                if (response.data.type !== 'application/octet-stream') {
                    reader.readAsText(response.data);
                    reader.onload = function () {
                        let result = JSON.parse(reader.result);
                        that.$message.error(result.message)
                    }
                    return false
                }
                this.previewVisible = true
                reader.readAsDataURL(response.data);
                reader.onload = function () {
                    let src = reader.result;
                    that.previewImgPath = src;
                }
            }).finally( () => {
                this.loading = false
            })
        },
        handleDelete(id) {
            this.delVisible = true
            this.delId = id
        },
        closePreviewDialog() {
            this.previewVisible = false
            this.previewImgPath = ''
        },
        closeDelDialog() {
            this.delVisible = false
            this.delId = null
        },
        submitDelete() {
            this.loading = true
            let params = {
                "id": this.delId
            }
            this.$axios.delete(this.HOST + `/admin/api/deleteFile?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    this.$message.success(response.data.message)
                    this.handleCurrentPageChange(this.page)
                } else {
                    this.$message.warning(response.data.message)
                }
                this.delVisible = false
            }).finally( () => {
                this.loading = false
            })
        },
        downloadFromQiNiu(fileInfo) {
            this.$axios({
                method: 'get',
                url: fileInfo.path,
                responseType: 'blob'
            }).then(response => {
                this.download(response, fileInfo.name)
            })
        },
        download(resp, fileName) {
            if (!resp.data)
                return
            let url = window.URL.createObjectURL(new Blob([resp.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', resp.headers.filename || fileName)
            
            document.body.appendChild(link)
            link.click()
        },
        downloadFile(fileInfo) {
            if (fileInfo.place === 'qiNiu') {
                this.downloadFromQiNiu(fileInfo)
                return
            }
            let queryData = {
                "fileName": fileInfo.path
            }
            this.$axios({
                method: 'post',
                url: this.HOST + `/admin/api/downloadFile?${stringify(queryData)}`,
                responseType: 'blob'
            }).then(response => {
                let that = this
                if (response.data.type !== 'application/octet-stream') {
                    let reader = new FileReader();
                    reader.readAsText(response.data);
                    reader.onload = function () {
                        let result = JSON.parse(reader.result);
                        that.$message.error(result.message)
                    }
                    return false
                }
                this.download(response)
            })
        },
        handleCurrentPageChange(val) {
            this.loading = true
            let queryData = {
                "page": val,
                "pageSize": this.pageSize
            }
            this.$axios.get(this.HOST + `/admin/api/attachmentList?${stringify(queryData)}`)
            .then(response => {
                if (response.data.code === 0) {
                    let resp = response.data.data
                    this.total = resp.total
                    this.attachmentList = resp.list,
                    this.page = val
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        beforeUpload(file) {
            if (file.size / 1024 /1024 > 2) {
                this.$message.warning("上传文件大小不能大于 2 M！");
                return false;
            }
        },
        changeUploadFrameVisible() {
            this.uploadFrameVisible = !this.uploadFrameVisible
        }
    }
}
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
