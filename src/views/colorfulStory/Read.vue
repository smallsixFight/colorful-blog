<template>
  <div class="book-info">
    <div class="preface">了解得越多，就能减少个人对各类事物无知产成的狭隘、偏见。 ——个人瞎掰</div>
     <h2>读过</h2>
    <div class="book-list" v-if="read_info && read_info.list.length > 0">
      <a v-for="item in read_info.list" :key="item.id" title="查看详细内容" @click="() => changeVisible(true, item)">
        <div class="book-image" :style="{backgroundImage:'url(' + item.pic_url + ')'}"></div>
        <div class="book-title">{{item.title}}</div>
      </a>
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
    <div class="book-list" v-if="wish_info && wish_info.list.length > 0">
    <hr>
    <h2>想读</h2>
      <a v-for="item in wish_info.list" :key="item.id" title="查看详细内容" @click="() => changeVisible(true, item)">
        <div class="book-image" :style="{backgroundImage:'url(' + item.pic_url + ')'}"></div>
        <div class="book-title">{{item.title}}</div>
      </a>
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
    <el-dialog
      :visible.sync="visible"
      title="详情"
      class="book-dialog"
      @closed="() => changeVisible(false)"
    >
      <el-form label-position="right">
        <el-form-item label="书 名: ">
          <a title="点击前往豆瓣" :href="book_info.douban_url" target="_blank">{{book_info.title}}</a>
        </el-form-item>
        <el-form-item label="作 者: ">
          <span style="width: 500px;">{{book_info.author_name}}</span>
        </el-form-item>
        <el-form-item label="简 介: ">
          <el-input readonly type="textarea" id="textarea" :rows="6" v-model="book_info.summary"></el-input>
        </el-form-item>
        <el-form-item label="读后感: " v-if="book_info.short_comment">
          <el-input
            readonly
            type="textarea"
            id="textarea"
            :rows="6"
            v-model="book_info.short_comment"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { stringify } from "qs";
export default {
  data() {
    return {
      visible: false,
      book_info: {},
      loading: false,
      wish_info: null,
      read_info: null,
      wish_page: 1,
      has_next_wish: false,
      has_next_raad: false,
      read_page: 1,
      page_size: 8
    };
  },
  created: function() {
    this.getBookInfo("all", 1);
  },
  methods: {
    changeVisible(status, info) {
      if (status) {
        info.summary = info.summary.replace(/\\n/g, "\n");
        info.short_comment &&
          (info.short_comment = info.short_comment.replace(/\\n/g, "\n"));
      }

      this.book_info = info ? info : {};
      this.visible = status;
    },
    getBookInfo(typ, p) {
      this.loading = true;
      let params = {
        page: p,
        page_size: this.page_size,
        type: typ
      };
      this.$axios
        .get(this.HOST + `/visitor/book/list?${stringify(params)}`)
        .then(resp => {
          if (resp.data.success) {
            let arr = resp.data.data;
            if (typ === "all") {
              for (let i in arr) {
                if (arr[i].type === "wish") {
                  this.wish_info = arr[i];
                  continue;
                }
                if (arr[i].type === "read") {
                  this.read_info = arr[i];
                }
              }
            } else if (typ === "wish") {
              this.wish_page += 1;
              this.wish_info.list.push(...arr[0].list);
            } else if (typ === "read") {
              this.read_page += 1;
              this.read_info.list.push(...arr[0].list);
            }
            this.has_next_wish =
              this.wish_page * this.page_size < this.wish_info.total;
            this.has_next_raad =
              this.read_page * this.page_size < this.read_info.total;
          } else {
            this.$message.error(resp.data.message);
          }
        })
        .finally(() => {
          setInterval(() => {
            this.loading = false;
          }, 1000);
        });
    }
  }
};
</script>