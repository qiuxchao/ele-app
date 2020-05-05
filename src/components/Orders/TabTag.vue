<template>
    <!-- 标签组件 -->
    <div class="input-wrap">
        <!-- 遍历标签数组，设置样式，当选中的样式等于当前的样式时，添加一个选中的样式，
        注册点击事件，把当前遍历到的项传过去 -->
        <span 
        v-for="(item, index) in tags" 
        :key="index" 
        class="form-span" 
        :class="{'checked': selectTag == item}"
        @click="$emit('checkTag', item)">
        {{ item }}
        </span>
    </div>

</template>

<script>
export default {
    name: "TabTag",
    props: {
        // 接收标签数组
        tags: Array,
        // 选中的标签
        selectTag: String
    }
}
</script>


<style scoped>
.input-wrap {
  flex: 1 1 0;
  padding: 2.666667vw 0;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
}
.input-wrap .form-span {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 1.066667vw;
  font-size: 0.9rem;
  color: #666;
  line-height: 7.466667vw;
  width: 18.133333vw;
  margin-right: 2.666667vw;
  text-align: center;
}
.checked {
  color: #2395ff !important;
  background: #eef7ff !important;
  border-color: rgba(35, 149, 255, 0.18) !important;
}

</style>