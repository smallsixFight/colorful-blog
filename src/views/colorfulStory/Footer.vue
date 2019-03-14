<template>
    <footer id="footer" role="contentinfo">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    &copy; {{ year }} colorful.
                    Designed by <a target="_blank" href="https://github.com/txperl/Story-for-Typecho/">Story - txperl</a>, Modified by lamlake.
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
        }
    }
}
</script>
