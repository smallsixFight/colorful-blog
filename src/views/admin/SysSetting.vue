<template>
  <div>
    <el-card class="page-header">
      <span>系统设置</span>
    </el-card>
    <el-card>
      <el-tabs v-model="select_tag" @tab-click="handleTagClick">
        <el-tab-pane label="博客设置" name="blog_setting">
          <el-form :model="blog_setting" label-width="80px" style="width: 40%; margin-top: 20px;">
            <el-form-item label="博客名称">
              <el-input v-model="blog_setting.blog_name" placeholder="请输入博客名称" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="success"
                @click="saveBlogInfo(1)"
                :loading="loading"
              >临时保存</el-button>
              <el-button
                size="small"
                type="primary"
                @click="saveBlogInfo(2)"
                :loading="loading"
              >永久保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="七牛云设置" name="qiniu_setting">
          <el-form :model="qiniu_setting" label-width="80px" style="width: 40%; margin-top: 20px;">
            <div>
              <el-form-item label="绑定域名">
                <el-input placeholder="请输入在七牛云绑定的域名" v-model="qiniu_setting.domain" size="small"></el-input>
              </el-form-item>
              <el-form-item label="AccessKey">
                <el-input
                  placeholder="请输入 accessKey"
                  v-model="qiniu_setting.access_key"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="SecretKey">
                <el-input
                  type="password"
                  v-model="qiniu_setting.secret_key"
                  placeholder="请输入 secretKey"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="Bucket">
                <el-input placeholder="请输入 bucket" v-model="qiniu_setting.bucket" size="small"></el-input>
              </el-form-item>
              <el-form-item label="存储地址">
                <el-input
                  placeholder="e.g. http://upload.qiniup.com"
                  v-model="qiniu_setting.upload_url"
                  size="small"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button
                size="small"
                type="success"
                @click="saveQiniuInfo(1)"
                :loading="loading"
              >临时保存</el-button>
              <el-button
                size="small"
                type="primary"
                @click="saveQiniuInfo(2)"
                :loading="loading"
              >永久保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="用户设置" name="user_setting">
          <el-form :model="user_setting" label-width="80px" style="width: 40%; margin-top: 20px;">
            <el-form-item label="名称">
              <el-input placeholder="请输入用户名称" size="small" v-model="user_setting.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input placeholder="请输入邮箱" size="small" v-model="user_setting.e_mail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="saveUserInfo" :loading="loading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码设置" name="pwd_setting">
          <el-form :model="pwd_setting" label-width="80px" style="width: 40%; margin-top: 20px;">
            <el-form-item label="旧密码">
              <el-input
                placeholder="请输入旧密码"
                type="password"
                size="small"
                v-model="pwd_setting.old_pwd"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                placeholder="请输入新密码"
                type="password"
                size="small"
                v-model="pwd_setting.new_pwd"
              ></el-input>
            </el-form-item>
            <el-form-item label="重复密码">
              <el-input
                placeholder="请再次输入新密码"
                type="password"
                size="small"
                v-model="pwd_setting.confirm_pwd"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="updatePwd" :loading="loading">保存</el-button>
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
    return {
      loading: false,
      select_tag: "blog_setting",
      blog_setting: {
        blog_name: ""
      },
      qiniu_setting: {
        domain: "",
        access_key: "",
        secret_key: "",
        bucket: "",
        upload_url: ""
      },
      user_setting: {
        username: "",
        e_mail: ""
      },
      pwd_setting: {
        old_pwd: "",
        new_pwd: "",
        confirm_pwd: ""
      }
    };
  },

  created: function() {
    this.getInitData();
  },

  methods: {
    getInitData() {
      this.loading = true;
      this.$axios
        .get(this.HOST + `/admin/sys/config`)
        .then(response => {
          if (response.data.success) {
            const data = response.data.data;
            this.blog_setting = data.blog_info;
            this.qiniu_setting = data.qiniu;
            this.user_setting = data.user_config;
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleTagClick() {
      if (this.select_tag === "pwd_setting") {
        this.pwd_setting = {
          old_pwd: "",
          new_pwd: "",
          confirm_pwd: ""
        };
      }
    },

    saveBlogInfo(typ) {
      this.loading = true;
      this.$axios
        .put(this.HOST + `/admin/sys/blog/info/update`, {
          ...this.blog_setting,
          typ
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
            this.getInitData();
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    saveQiniuInfo(typ) {
      this.loading = true;
      this.$axios
        .put(this.HOST + `/admin/sys/qiniu/setting/update`, {
          ...this.qiniu_setting,
          typ
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
            this.getInitData();
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    saveUserInfo() {
      this.loading = true;
      this.$axios
        .put(this.HOST + `/admin/user/info/update`, {
          ...this.user_setting
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
            sessionStorage.setItem("ms_username", this.user_setting.username);
            this.getInitData();
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    updatePwd() {
      if (this.pwd_setting.old_pwd.trim() === "") {
        this.$message.warning("请输入旧密码");
        return;
      }
      if (
        this.pwd_setting.new_pwd.trim() === "" ||
        this.pwd_setting.confirm_pwd.trim() === ""
      ) {
        this.$message.warning("请输入新密码/重复密码");
        return;
      }
      if (
        this.pwd_setting.new_pwd.trim() !== this.pwd_setting.confirm_pwd.trim()
      ) {
        this.$message.warning("两次密码输入不一致");
        return;
      }
      this.loading = true;
      this.$axios
        .post(this.HOST + `/admin/user/pwd/update`, {
          ...this.pwd_setting
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success(response.data.message);
            this.handleTagClick();
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>