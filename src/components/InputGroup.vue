<template>
    <!-- 登录组件，包含了输入框和验证码按钮 -->
    <!-- html 部分 -->
  <div class="text_group">
      <!-- 组件结构 -->

          <!-- 组件容器 -->
          <div class="input_group" :class="{'is-invalid':error}">
            <!-- 输入框 -->
            <input :type="type" :value="value" :placeholder="placeholder" :name="name" @input="$emit('input', $event.target.value)">
            <!-- 输入框后面的获取验证码按钮 -->
            <button v-if="btnTitle" :disabled="disabled" @click="$emit('btnClick')">{{ btnTitle }}</button>
      </div>
       <!-- 验证码错误提醒 -->
      <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script>
// js 部分
export default {
    name: "inputGroup",
    props: {  // 此组件需要接收调用组件的地方传来的值
        type: { // 默认类型设置
            type: String,
            default: "text"
        },
        value: String,            // 值类型
        placeholder: String, // 占位类型
        name: String,          // 名字输入框类型
        btnTitle: String,    // 获取验证码按钮值类型
        disabled: Boolean,  // 获取验证码按钮是否可用
        error: String        // 是否弹出验证码错误信息

    },
    data() {
        return {

        };
    }
};
</script>

<style scoped>
/* css 部分 */
.input_group {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input_group input {
  border: none;
  height: 100%;
  width: 60%;
  outline: none;
}
.input_group button {
  border: none;
  outline: none;
  background: #fff;
}
.input_group button[disabled] {
  color: #aaa;
}
.is-invalid {
  border: 1px solid red;
}
.invalid-feedback {
  color: red;
  padding-top: 5px;
}
</style>
