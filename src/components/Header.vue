<template>
    <!-- Header 组件，定义了页面的头部，内容包括左侧返回按钮和中间标题 -->
  <!-- html 部分 -->
  <div class="header">
    <!-- 左侧返回按钮 -->
    <div class="header-button is-left" v-show="isLeft">
      <!-- 按钮图标 -->
      <i class="fa fa-chevron-left"></i>
      <!-- $router.go(-1)  表示返回上一层路由 -->
      <!-- 这里注册了一个 changeRouter 事件，当在其他页面中调用该按钮时，应指定要跳转的路由地址 -->
      <button @click="$emit('changeRouter')">返回</button>
    </div>

    <!-- 中间标题 -->
    <h1 class="header-title">{{ title }}</h1>
  </div>
</template>

<script>
// js 部分
export default {
  name: "Header",
  data() {
    return {};
  },
  props: {
    title: String,
    isLeft: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
/* css 部分 */
.header {
  align-items: center;
  background-color: #009eef;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 16px;
  height: 45px;
  line-height: 1;
  padding: 0 10px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
}

.header-button button {
  background-color: transparent;
  border: 0;
  box-shadow: none;
  color: inherit;
  display: inline-block;
  padding: 0;
  font-size: inherit;
  outline: none;
}
.header-title {
  flex: 1;
}
.is-left {
  text-align: left;
}
</style>
