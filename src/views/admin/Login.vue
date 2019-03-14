<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">Colorful</div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="account">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="loginForm.password" @keyup.enter.native="logging('loginForm')">
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="logging" :loading="loading">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                loading: false,
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            logging() {
                this.$refs['loginForm'].validate((valid) => {
                    if (!valid)
                        return false
                    
                    this.loading = true
                    this.$axios.post(this.HOST + "/admin/api/login", {
                    ...this.loginForm
                    }).then(response => {
                        if (response.data.code === 0) {
                            const resp = response.data.data
                            localStorage.setItem("accessToken", resp.token)
                            localStorage.setItem("ms_username", resp.ms_username)
                            this.$message.success(response.data.message)
                            this.$router.replace('/admin');
                        } else {
                            this.$message.error(response.data.message)
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
.login-wrap {
    position: relative;
    width:100%;
    height:100%;
    background-image: url(http://media.lamlake.com/blog_background.jpg);
    background-size: 100%;
}
.ms-title {
    width:100%;
    line-height: 50px;
    text-align: center;
    font-size:20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left:50%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width:100%;
    height:36px;
    margin-bottom: 10px;
}
.login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
}
</style>