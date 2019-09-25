<template>
  <div>
    <el-select v-model="value" size="small" :multiple="is_multiple" @change='handleChange'>
      <el-option v-for="item in meta_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>
<script>
import { stringify } from 'qs';
export default {
  name: "metaList",
  props: ["type", "defaultVal", 'multiple'],
  created: function() {
    if (!this.typ) {
      return;
    }
    console.log(this.typ);
    let queryData = {
      type: this.typ
    };
    this.$axios
      .get(this.HOST + `/admin/category_tag/list?${stringify(queryData)}`)
      .then(response => {
        if (response.data.success) {
          this.meta_list = response.data.data;
        } else {
          this.$message.warning(response.data.message);
        }
      });
  },
  data() {
    return {
      meta_list: null,
      value: this.defaultVal,
      typ: this.type,
      is_multiple: this.multiple
    };
  },
  methods: {
    handleChange() {
      this.$emit('change', this.value);
    }
  }
};
</script>