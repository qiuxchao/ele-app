<template>
    <!-- 当前定位展示组件 -->
    <!-- html 部分 -->
  <div>
      <div class="title">当前定位</div>
      <div class="des" @click="$emit('click')">
          <!-- 定位图标 -->
          <i class="fa fa-location-arrow"></i>
          <!-- 定位信息 -->
          <span>{{ address }}</span>
      </div>
  </div>
</template>

<script>
// js 部分
export default {
    name: "Location",
    props: {
        address: String
    }
};
</script>

<style scoped>
/* css 部分 */
.title {
  margin: 10px 0;
  font-size: 12px;
}
.des i {
  color: #009eef;
}
.des span {
  color: #333;
  font-weight: bold;
  margin-left: 5px;
  display: inline-block;
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
