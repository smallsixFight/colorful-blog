<template>
  <div>
    <h1 style="text-align:center;">读书</h1>
    <hr />
    <div class="book-background">
      <div v-if="wish_info && wish_info.list.length > 0">
        <h3>想读</h3>
        <div class="douban-book-list doubanboard-list">
          <div
            class="doubanboard-item"
            v-for="item in wish_info.list"
            :key="item.id"
            title="查看详细内容"
          >
            <a @click="() => changeVisible(true, item)">
              <div class="doubanboard-thumb" :style="{backgroundImage:'url(' + item.pic_url + ')'}"></div>
              <div class="doubanboard-title">{{item.title}}</div>
            </a>
          </div>
        </div>
        <div style="text-align: center">
          <el-button
            :loading="loading"
            class="button"
            v-if="has_next_wish"
            @click="() => getBookInfo('wish', wish_page +1)"
          >加载更多</el-button>
          <el-button class="button" v-else>无啦</el-button>
        </div>
      </div>
      <div v-if="read_info && read_info.list.length > 0">
        <hr />
        <h3>读过</h3>
        <div class="douban-book-list doubanboard-list">
          <div
            class="doubanboard-item"
            v-for="item in read_info.list"
            :key="item.id"
            :title="查看详细内容"
          >
            <a @click="() => changeVisible(true, item)">
              <div class="doubanboard-thumb" :style="{backgroundImage:'url(' + item.pic_url + ')'}"></div>
              <div class="doubanboard-title">{{item.title}}</div>
            </a>
          </div>
        </div>
        <div style="text-align: center">
          <el-button
            :loading="loading"
            class="button"
            v-if="has_next_raad"
            @click="() => getBookInfo('read', read_page +1)"
          >加载更多</el-button>
          <el-button class="button" v-else>无啦</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="visible"
      title="详情"
      @closed="() => changeVisible(false)"
      width="760px"
    >
      <el-form label-position="right" label-width="100px" style="margin-left: 5%; margin-right: 5%">
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

<style scope>
.button {
  font-size: 18px;
  background-color: #d5d5d5;
  color: #000;
  border-color: #d5d5d5;
}

.button:hover {
  font-size: 18px;
  background-color: #a5a5a5;
  color: #000;
  border-color: #a5a5a5;
}

#textarea {
  width: 500px;
  overflow-x: scroll;
  overflow-y: scroll;
  box-sizing: border-box;
  margin-top: 10px;
  padding-top: 10px;
}

#textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
#textarea::-webkit-scrollbar-thumb {
  height: 40px;
  background-color: #bbb;
  border-radius: 16px;
}
#textarea::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}
.book-background {
  margin-left: 10%;
  margin-right: 10%;
}

.doubanboard-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  max-width: 100%;
  margin-top: 1em;
}
.doubanboard-list * {
  box-sizing: border-box;
}
.doubanboard-item {
  position: relative;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transition: ease all 0.3s;
  overflow: hidden;
  background: #e7e8e1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: none !important;
  display: block;
}
.doubanboard-thumb {
  width: 100%;
  padding-top: 141%;
  background-repeat: no-repeat;
  background-size: cover;
}
.doubanboard-title,
.doubanboard-title a {
  margin: 8px 0 !important;
  font-size: 1.2em !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  text-align: center !important;
  color: #202020 !important;
  font-weight: 700 !important;
  border: none !important;
}

@media screen and (min-width: 769px) {
  .doubanboard-item {
    width: 12%;
    min-width: 12%;
    max-width: 12%;
    margin: 2%;
    margin-left: 8%;
  }
}
@media screen and (max-width: 400px) {
  .doubanboard-item {
    width: 45%;
    min-width: 45%;
    max-width: 45%;
    margin: 2.5%;
  }
}
</style>
