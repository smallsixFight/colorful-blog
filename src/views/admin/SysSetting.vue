<template>
    <div>
        <el-card class="page-header">
            <span>系统设置</span>
        </el-card>
        <el-card>
            <el-tabs v-model="selectTag">
                <el-tab-pane label="基本设置" name="basicSetting">
                    <el-form :model="basicSettingForm" label-width="80px" style="width: 40%; margin-top: 20px;">
                        <el-form-item label="博客名称">
                            <el-input v-model="basicSettingForm.blogName" placeholder="博客名称" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名称">
                            <el-input v-model="basicSettingForm.username" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="显示昵称">
                            <el-input v-model="basicSettingForm.screenName" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="域名">
                            <el-input v-model="basicSettingForm.homeUrl" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="basicSettingForm.email" size="small"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitBasicForm" :loading="loading">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="附件设置" name="acctchmentSetting">
                    <el-form :model="attachSettingForm" label-width="80px" style="width: 40%; margin-top: 20px;">
                        <el-form-item label="存储位置">
                            <el-radio-group v-model="attachSettingForm.attachSavePlace" @change="handleRadioChange">
                                <el-radio label="local">本地</el-radio>
                                <el-radio label="qiNiuYun">七牛云</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-if="qiNiuYunOptions">
                            <el-form-item label="域名">
                                <el-input v-model="attachSettingForm.qiNiuYunDomain" size="small"></el-input>
                            </el-form-item>
                            <el-form-item label="AccessKey">
                                <el-input v-model="attachSettingForm.qiNiuYunAccessKey" size="small"></el-input>
                            </el-form-item>
                            <el-form-item label="SecretKey">
                                <el-input v-model="attachSettingForm.qiNiuYunSecretKey" size="small"></el-input>
                            </el-form-item>
                            <el-form-item label="Bucket">
                                <el-input v-model="attachSettingForm.qiNiuYunBucket" size="small"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitAttachSettingForm" :loading="loading">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="密码修改" name="passwordChange">
                    <el-form :model="passwordForm" :rules="passwordRule" ref="passwordForm" label-width="80px" style="width: 40%; margin-top: 20px;">
                        <el-form-item label="原密码" prop="oldPass">
                            <el-input type="password" size="small" v-model="passwordForm.oldPass"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPass">
                            <el-input type="password" size="small" v-model="passwordForm.newPass"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" size="small" v-model="passwordForm.checkPass"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="changePass" :loading="loading">修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        let validateOldPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            }
            callback()
        };
        let validateNewPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新的密码'));
            }
            callback()
        };
        let validateCheckPass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordForm.newPass) {
                callback(new Error('两次输入密码不一致!'));
            }
            callback()
        };
        return {
            loading: false,
            qiNiuYunOptions: false,
            selectTag: 'basicSetting',
            basicSettingForm: {
                blogName: '',
                username: '',
                screenName: '',
                email: '',
                homeUrl: ''
            },
            attachSettingForm: {
                attachSavePlace: 'local',
                qiNiuYunDomain: '',
                qiNiuYunAccessKey: '',
                qiNiuYunSecretKey: '',
                qiNiuYunBucket: ''
            },
            passwordForm: {
                oldPass: '',
                newPass: '',
                checkPass: ''
            },
            passwordRule: {
                oldPass: [
                    { validator: validateOldPass, trigger: 'blur' }
                ],
                newPass: [
                    { validator: validateNewPass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validateCheckPass, trigger: 'blur' }
                ],
            }
        }
    },
    created: function() {
        this.loading = true
        this.$axios.get(this.HOST + `/admin/api/sysSettingInfo`)
        .then(response => {
            if (response.data.code === 0) {
                const resp = response.data.data
                this.attachSettingForm.qiNiuYunDomain = resp.blogOptions.qiNiuYunDomain || '';
                this.attachSettingForm.qiNiuYunAccessKey = resp.blogOptions.qiNiuYunAccessKey || '';
                this.attachSettingForm.qiNiuYunSecretKey = resp.blogOptions.qiNiuYunSecretKey || '';
                this.attachSettingForm.qiNiuYunBucket = resp.blogOptions.qiNiuYunBucket || '';
                this.attachSettingForm.attachSavePlace = resp.blogOptions.attachSavePlace;
                this.basicSettingForm.blogName = resp.users.blogName;
                this.basicSettingForm.username = resp.users.username;
                this.basicSettingForm.screenName = resp.users.screenName;
                this.basicSettingForm.email = resp.users.email;
                this.basicSettingForm.homeUrl = resp.users.homeUrl;
                this.handleRadioChange(resp.blogOptions.attachSavePlace)
            } else {
                this.$message.warning(response.data.message)
            }
        }).finally( () => {
            this.loading = false
        })
    },
    methods: {
        changePass() {
            this.$refs['passwordForm'].validate((valid) => {
                if (!valid)
                    return false
                this.loading = true
                this.$axios.post(this.HOST + "/admin/api/changePassword", {
                ...this.passwordForm
                }).then(response => {
                    if (response.data.code === 0) {
                        this.$refs['passwordForm'].resetFields();
                        this.$message.success(response.data.message)
                    } else {
                        this.$message.warning(response.data.message)
                    }
                }).finally( () => {
                    this.loading = false
                })
            })
        },
        submitAttachSettingForm() {
            this.loading = true
            this.$axios.post(this.HOST + "/admin/api/updateAttachSetting", {
                ...this.attachSettingForm
            }).then(response => {
                if (response.data.code === 0) {
                    this.dialogFormVisible = false
                    this.$message.success(response.data.message)
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },
        submitBasicForm() {
            this.loading = true
            this.$axios.post(this.HOST + "/admin/api/updateBasicSetting", {
                ...this.basicSettingForm
            }).then(response => {
                if (response.data.code === 0) {
                    this.dialogFormVisible = false
                    this.$message.success(response.data.message)
                } else {
                    this.$message.warning(response.data.message)
                }
            }).finally( () => {
                this.loading = false
            })
        },

        handleRadioChange(val) {
            this.attachSettingForm.attachSavePlace = val
            if (val === 'local') {
                this.qiNiuYunOptions = false
            } else if (val === 'qiNiuYun') {
                this.qiNiuYunOptions = true
            }
            
            
        }
    }
}
</script>

