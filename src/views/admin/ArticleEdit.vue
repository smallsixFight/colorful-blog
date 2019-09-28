<template>
    <div v-loading="loading">
        <el-form :model="articleForm" :rules="rules" ref="articleForm">
            <el-card class="page-header">
                <span>文章编辑</span>
            </el-card>
            <el-card>
                <div class="article-select">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="分类">
                                <metaList type=2 :defaultVal='articleForm.category' v-on:change="handleCatoryChange" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="标签">
                                <metaList type=1 :defaultVal='articleForm.tags' :multiple='true' v-on:change="handleTagsChange" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开启评论">
                                <el-select v-model="articleForm.allowComment" size="small">
                                    <el-option :key=1 :value='1' label="是"></el-option>
                                    <el-option :key=0 :value='0' label="否"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item prop='title'>
                    <el-input placeholder="输入文章标题" v-model="articleForm.title" class="article-title"></el-input>
                </el-form-item>
                <el-form-item prop="content">
                    <markdownEdit :val='articleForm.content' v-on:change="handleContentChange"></markdownEdit>
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
import markdownEdit from '../components/MarkdownEdit';
import metaList from '../components/LookupMeta';
import 'mavon-editor/dist/css/index.css';
// import { stringify } from 'qs'
export default {
    name: "articleEdit",
    data() {
        return {
            loading: false,
            articleForm: {
                content: '',
                title: '',
                allowComment: 1,
                category: '2',
                tags: ['12'],
                slug: ''
            },
            rules: {
                 title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ]
            },
            html:'',
            categoryList: [],
            tagList: []
            
        }
    },
    components: {
        markdownEdit,
        metaList
    },
    created: function() {
        // const cid = this.$route.query.cid
        // this.getInitalizeData(cid);
    },
    methods: {
        handleContentChange(val) {
            this.articleForm.content = val
        },
        handleCatoryChange(val) {
            this.articleForm.category = val;
        },
        handleTagsChange(val) {
            this.articleForm.tags = val;
        },
        submit(status) {
            console.log(this.articleForm.tags)
            this.$refs['articleForm'].validate((valid) => {
                if (!valid)
                    return false
                this.loading = true
                this.articleForm.status = status
                this.articleForm.tags = this.articleForm.tags ? this.articleForm.tags.join(',') : ''
                this.$axios.post(this.HOST + "/admin/api/addOrUpdateArticle", {
                    ...this.articleForm
                }).then(response => {
                    if (response.data.code === 0) {
                        this.dialogFormVisible = false
                        this.$router.replace('/admin/articleList')
                        this.$message.success(response.data.message)
                    } else {
                        this.$message.warning(response.data.message)
                    }
                }).finally( () => {
                    this.loading = false
                })
            })
            
        }
    }
}
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