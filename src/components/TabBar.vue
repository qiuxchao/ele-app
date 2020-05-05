<template>
    <!-- 底部导航组件，包含了可以跳转的图标和文字 -->
    <!-- html 部分 -->
  <div class="tabbar">
      <!-- 导航按钮，是可以跳转的 -->
      <router-link class="tab-item" v-for="(item, index) in data" :key="index" :to="item.path" active-class="is-selected">
          <!-- 图标 -->
          <div class="tab-item-icon">
              <i :class="'fa fa-' + item.icon"></i>
          </div>
          <!-- 文字 -->
          <div class="tab-item-label">{{ item.title }}</div>
      </router-link>
  </div>
</template>

<script>
// js 部分
export default {
    name: "tabbar",
    props: {
        // 接收值类型，数组，因为顶部导航每一项中都包含了图标和标题
        data: Array
    },
    data() {
        return {

        };
    }
};
</script>

<style scoped>
/* css 部分 */
.tabbar {
  height: 45px;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-image: linear-gradient(
    180deg,
    #d9d9d9,
    #d9d9d9 50%,
    transparent 0
  );
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-color: #fafafa;
  display: flex;
  text-align: center;
}
.tab-item {
  display: block;
  padding: 3px 0;
  flex: 1;
}
.tab-item-icon {
  width: 20px;
  height: 20px;
  margin: 0 auto 5px;
}
.tab-item-icon i {
  font-size: 16px;
}
.tab-item-label {
  color: inherit;
  font-size: 10px;
  line-height: 1;
}
a {
  text-decoration: none;
  color: #999;
}
.is-selected {
  color: #009eef;
}

</style>
