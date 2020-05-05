<template>
    <!-- 总的组件页面，使用了路由 -->
    <!-- html 部分 -->
  <div class="index">
      
      <!-- 使用路由，展示子路由页面 -->
      <router-view></router-view>
      <!-- 使用底部导航组件，把设定的值传过去 -->
      <TabBar :data="tabbarData" />
  </div>
</template>

<script>
// js 部分
import TabBar from '../components/TabBar'
export default {
    name: "index",
    data() {
        return {
            tabbarData: [   // 底部导航用到的信息
                {title: "首页", icon: "home", path: "/home"},
                {title: "订单", icon: "file-text-o", path: "/order"},
                {title: "我的", icon: "user", path: "/me"}
            ]
        };
    },
    components: {
        // 注册组件
        TabBar
    }
};
</script>

<style scoped>
/* css 部分 */
.index {
    width: 100%;
    height: calc(100% - 45px);
}

</style>
