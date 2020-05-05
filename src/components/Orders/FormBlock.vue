<template>
    <!-- 添加地址的表单组件 -->

    <div class="formblock" @click="$emit('click')">
        <!-- label 标题 -->
        <div class="label-wrap">{{ label }}</div>
        <!-- 表单 -->
        <div class="input-group-wrap">
            <div class="input-wrap">
                <!-- input 标签，如果传了 textarea 就不显示该标签了 -->
                <input 
                v-if="!textarea" 
                :type="type" 
                :value="value" 
                :placeholder="placeholder" 
                @input="$emit('input', $event.target.value)"
                >
                
                <!-- textarea 标签，传了 textarea 才会显示，否则默认显示 input  -->
                <textarea 
                v-else 
                rows="2" 
                maxlength="100" 
                :type="type" 
                :value="value" 
                :placeholder="placeholder" 
                @input="$emit('input', $event.target.value)"
                >
                </textarea>
            <!-- 判断输入框右侧有无图标 -->
            <i v-if="icon" :class="'fa fa-' + icon"></i>
            </div>
            <!-- 标签(先生，女士) -->
            <!-- 接收添加地址组件传来的值，再传给标签组件 -->
            <TabTag v-if="tags" :tags="tags" @checkTag="checkTag" :selectTag="sex" />
        </div>


    </div>

</template>


<script>
// 引入标签组件
import TabTag from './TabTag'
export default {
    name: "FormBlock",
    props: {
        type: { // 接收输入框的类型，默认为 text
            type: String,
            default: "text"
        },
        label: String,  // 输入框标题
        value: String,  // 输入框内容
        placeholder: String, // 占位字符
        icon: String,   // 右侧图标
        textarea: String,    // 文本域
		tags: Array,     // 标签组件需要的数组
		sex: String		// 选中的性别，从调用的组件接收，传给标签组件
    },
    components: {
        // 注册组件
        TabTag
    },
    methods: {
        checkTag(item) {
            // 点击标签时的函数
            // console.log(item);
            // 把标签组件传来的值接收到，再传给调用该表单组件的组件
            this.$emit('checkSex', item);
        }
    }
}
</script>


<style scoped>
.formblock {
  /* border-top: 0.266667vw solid #eee; */
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}
.input-group-wrap {
  flex: 1;
}
.input-wrap {
  flex: 1 1 0;
  padding: 3.733333vw 0;
  display: flex;
  align-items: center;
}
.input-wrap input {
  outline: none;
  line-height: 4.8vw;
  color: #333;
  border: none;
  flex: 1;
  padding-right: 4vw;
  padding-left: 0;
  font-size: 0.9rem;
}

.input-wrap textarea {
  outline: none;
  font-size: 0.9rem;
  line-height: 4.8vw;
  color: #333;
  border: none;
  flex: 1;
  padding-right: 4vw;
  padding-left: 0;
}
.input-wrap i {
  margin-right: 3.2vw;
  color: rgb(102, 102, 102);
  font-size: 1.2rem;
}
</style>