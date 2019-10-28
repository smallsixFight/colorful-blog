<template>
  <footer id="footer" role="contentinfo">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          &copy; {{ year }} Colorful |
          Designed by
          <a
            target="_blank"
            href="https://github.com/txperl/Story-for-Typecho/"
          >txperl‘ story</a>, Modified by lamlake
          <p>粤 ICP 备 18051440 号</p>
        </div>
      </div>
    </div>
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
