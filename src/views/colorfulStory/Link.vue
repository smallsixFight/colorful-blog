<template>
  <div v-loading="loading">
    <div class="preface">你，想成为我的 TOMODACHI 吗？（掩面，逃</div>
    <div class="link-list">
      <main>
          <ul v-if="link_list.length > 0">
            <li v-for="link in link_list" :key="link.id">
              <a target="_blank" :title="link.description" :href="link.url">{{link.owner}}</a>
            </li>
          </ul>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      link_list: []
    };
  },
  created: function() {
    this.loading = true;
    this.$axios
      .get(this.HOST + `/visitor/link/list`)
      .then(resp => {
        if (resp.data.success) {
          this.link_list = resp.data.data;
        } else {
          this.$message.error(resp.data.message);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>
