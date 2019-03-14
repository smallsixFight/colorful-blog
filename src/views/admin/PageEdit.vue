<template>
    <div v-loading="loading">
        <el-form :model="pageForm" :rules="rules" ref="pageForm">
            <el-card class="page-header">
                <span>文章编辑</span>
            </el-card>
            <el-card>
                <el-form-item>
                    <el-input v-model="pageForm.slug" placeholder="自定义路径 例: example" size="small"></el-input>
                </el-form-item>
                <el-form-item prop="title">
                    <el-input placeholder="输入文章标题" v-model="pageForm.title" class="article-title"></el-input>
                </el-form-item>
                <el-form-item prop="content">
                    <mavon-editor v-model="pageForm.content" ref="md" @change="change" style="min-height: 600px;" />
                </el-form-item>
                <el-form-item>
                    <div style="float: right;">
                        <el-button class="editor-btn" size="small" type="warning" @click="submit('draft')">保存草稿</el-button>
                        <el-button class="editor-btn" size="small" type="primary" @click="submit('publish')">发布</el-button>
                    </div>
                </el-form-item>
            </el-card>
        </el-form>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { stringify } from 'qs'
export default {
    name: "PageEdit",
    data() {
        return {
            loading: false,
            pageForm: {
                content: '',
                title: '',
                slug: ''
            },
            rules: {
                 title: [
                    { required: true, message: '请输入页面标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入页面内容', trigger: 'blur' }
                ]
            },
            html:'',
        }
    },
    components: {
        mavonEditor
    },
    created: function() {
        const cid = this.$route.query.cid
        if (cid) {
            this.getInitalizeData(cid);
        }
    },
    methods: {
        submit(status) {
            this.$refs['pageForm'].validate((valid) => {
                if (!valid)
                    return false
                this.loading = true
                this.pageForm.status = status
                this.$axios.post(this.HOST + "/admin/api/addOrUpdatePage", {
                    ...this.pageForm
                }).then(response => {
                    if (response.data.code === 0) {
                        this.dialogFormVisible = false
                        this.$router.replace('/admin/pageList')
                        this.$message.success(response.data.message)
                    } else {
                        this.$message.warning(response.data.message)
                    }
                }).finally( () => {
                    this.loading = false
                })
            })
        },
        getInitalizeData(cid) {
            this.loading = true
            let params = {
                "cid": cid
            }
            this.$axios.get(this.HOST + `/admin/api/pageEditInitData?${stringify(params)}`)
            .then(response => {
                if (response.data.code === 0) {
                    const resp = response.data.data
                    this.pageForm.cid = resp.cid
                    this.pageForm.title = resp.title
                    this.pageForm.content = resp.content
                    this.pageForm.slug = resp.slug || ''
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        change(value, render) {
            this.html = render;
        }
    }
}
</script>

<style scoped>
.editor-btn {
    margin-top: 20px;
    margin-bottom: 20px;
}
.article-title {
    margin-top: 10px;
    margin-bottom: 16px;
}
</style>