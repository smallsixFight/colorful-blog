<template>
  <footer>
    <span>&copy; {{ year }} Colorful | Design by lamlake | 粤 ICP 备 18051440 号</span>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
