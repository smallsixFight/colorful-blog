<template>
  <div class="login-wrap">
    <div class="bg"></div>
    <div class="ms-login">
      <div class="ms-title">Colorful</div>
      <el-form
        :model="login_form"
        :rules="rules"
        ref="login_form"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="login_form.username" placeholder="account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="login_form.password"
            @keyup.enter.native="logging('login_form')"
          ></el-input>
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
  data: function() {
    return {
      loading: false,
      login_form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    logging() {
      this.$refs["login_form"].validate(valid => {
        if (!valid) return false;

        this.loading = true;
        this.$axios
          .post(this.HOST + "/admin/login", {
            ...this.login_form
          })
          .then(resp => {
            if (resp.data.success) {
              sessionStorage.setItem("accessToken", resp.data.token);
              sessionStorage.setItem("ms_username", this.login_form.username);
              this.$message.success(resp.data.message);
              this.$router.replace("/admin");
            } else {
              this.$message.error(resp.data.message);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  width: 100%;
  height: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #414141;
  border-bottom: 1px solid #5e5e5e;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: #ebebeb;
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>