<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1" @click="jump('articleList')">
            <div class="grid-cont-right">
              <div class="grid-num">{{ statistics.article_num || 0 }}</div>
              <div>文章</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1" @click="jump('commentList')">
            <div class="grid-cont-right">
              <div class="grid-num">{{ statistics.comment_num || 0 }}</div>
              <div>评论</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1" @click="jump('linkList')">
            <div class="grid-cont-right">
              <div class="grid-num">{{ statistics.link_num || 0 }}</div>
              <div>友链</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1" @click="jump('sysLog')">
            <div class="grid-cont-right">
              <div class="grid-num">{{ statistics.log_num || 0 }}</div>
              <div>系统日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" style="height:440px;">
          <div slot="header" class="clearfix">
            <span>最近文章</span>
          </div>
          <el-table
            :data="article_list"
            size="small"
            
            style="width: 100%;font-size:16px;"
          >
            <el-table-column label="标题">
              <template v-slot:default="article">
                <span class="table-column-cell">{{ article.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template v-slot:default="article">
                <el-tag
                  :type="article.row.status ? 'success' : 'warning'"
                >{{article.row.status ? "已发布" : "草稿"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template v-slot:default="article">
                <span class="table-column-cell">{{ article.row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最近更新时间" align="center">
              <template v-slot:default="article">
                <span class="table-column-cell">{{ article.row.modify_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="height:440px;">
          <div slot="header" class="clearfix">
            <span>最新评论</span>
          </div>
          <el-table
            :data="comment_list"
            size="small"
            style="width: 100%;font-size:16px;"
          >
          <el-table-column label="文章" align="left">
              <template v-slot:default="comment">
                <span class="table-column-cell">{{ comment.row.content_title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评论内容" align="center">
              <template v-slot:default="comment">
                <span class="table-column-cell">{{ comment.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评论者" align="center">
              <template v-slot:default="comment">
                <span class="table-column-cell">{{ comment.row.commentator }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template v-slot:default="comment">
                <el-tag
                  :type="comment.row.status ? 'success' : 'warning'"
                >{{comment.row.status ? "通过" : "待审核"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="日期" header-align="center">
              <template v-slot:default="comment">
                <span class="table-column-cell">{{ comment.row.create_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" style="height:440px;">
          <div slot="header" class="clearfix">
            <span>最近友链</span>
          </div>
          <el-table
            :data="link_list"
            size="small"
            height="440"
            style="width: 100%;font-size:16px;"
          >
            <el-table-column label="链接" align="center">
              <template v-slot:default="link">
                <span class="table-column-cell">{{ link.row.url }}</span>
              </template>
            </el-table-column>
            <el-table-column label="持有者" align="center">
              <template v-slot:default="link">
                <span class="table-column-cell">{{ link.row.owner }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template v-slot:default="link">
                <span class="table-column-cell">{{ link.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template v-slot:default="link">
                <el-tag
                  :type="link.row.status ? 'success' : 'warning'"
                >{{link.row.status ? "发布" : "隐藏"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="添加日期" align="center">
              <template v-slot:default="link">
                <span class="table-column-cell">{{ link.row.create_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="height:440px;">
          <div slot="header" class="clearfix">
            <span>最近日志</span>
          </div>
          <el-table
            :data="log_list"
            size="small"
            style="width: 100%;font-size:16px;"
          >
            <el-table-column label="操作" width="240px">
              <template v-slot:default="log">
                <span class="table-column-cell">{{ log.row.action }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果">
              <template v-slot:default="log">
                <span class="table-column-cell">{{ log.row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IP" align="center">
              <template v-slot:default="log">
                <span class="table-column-cell">{{ log.row.ip }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作时间" align="center">
              <template v-slot:default="log">
                <span class="table-column-cell">{{ log.row.create_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comment_list: [],
      article_list: [],
      link_list: [],
      log_list: [],
      statistics: {},
      loading: false
    };
  },
  methods: {
    jump(param) {
      this.$router.replace(param);
    }
  },
  created: function() {
    this.loading = true;
    this.$axios
      .get(this.HOST + "/admin/dashboard/info")
      .then(response => {
        if (response.data.success) {
          let resp = response.data.data;
          this.comment_list = resp.comment_list;
          this.article_list = resp.article_list;
          this.link_list = resp.link_list;
          this.log_list = resp.log_list;
          this.statistics = {
              article_num: resp.article_num,
              comment_num: resp.comment_num,
              link_num: resp.link_num,
              log_num: resp.log_num,
          };
        } else {
          this.$message.error(response.data.message);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.table-column-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #999;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.card {
  margin-bottom: 10px;
}
</style>

