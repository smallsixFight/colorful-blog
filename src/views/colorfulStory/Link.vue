<template>
  <div v-loading="loading">
    <div class="preface">如果你有难，我会随时地来帮你。但是，如果我有难，我就绝对不出现在你的面前。 ——《北野武的小酒馆》</div>
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
