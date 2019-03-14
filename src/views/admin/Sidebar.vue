<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '@/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-menu',
                    index: 'dashboard',
                    title: '仪表盘'
                },
                {
                    icon: 'el-icon-document',
                    index: 'article',
                    title: '文章',
                    subs: [
                        {
                            index: 'articleList',
                            title: '文章列表'
                        },
                        {
                            index: 'articleEdit',
                            title: '文章编辑'
                        }
                    ]
                },
                {
                    icon: 'el-icon-tickets',
                    index: 'page',
                    title: '页面',
                    subs: [
                        {
                            index: 'pageList',
                            title: '页面列表'
                        },
                        {
                            index: 'pageEdit',
                            title: '页面编辑'
                        }
                    ]
                },
                {
                    icon: 'el-icon-message',
                    index: 'commentList',
                    title: '评论管理'
                },
                {
                    icon: 'el-icon-edit',
                    index: 'categoryTagList',
                    title: '分类 / 标签'
                },
                {
                    icon: 'el-icon-upload',
                    index: 'attachmentManagement',
                    title: '附件管理'
                },
                {
                    icon: 'el-icon-share',
                    index: 'linkList',
                    title: '友链管理'
                },
                // {
                //     icon: 'el-icon-tickets',
                //     index: 'logList',
                //     title: '系统日志'
                // },
                {
                    icon: 'el-icon-setting',
                    index: 'sysSetting',
                    title: '系统设置'
                }
            ]
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/admin/', '')
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
        })
    }
}
</script>

<style scoped>
.sidebar{
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom:0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar{
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse){
    width: 250px;
}
.sidebar > ul {
    height:100%;
}
</style>

