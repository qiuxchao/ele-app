<template>
    <!-- 备注信息 -->

    <div class="remark">
        <!-- 调用 Header 组件构建头部 -->
        <Header :isLeft="true" title="订单备注" @changeRouter="$router.go(-1)" />

        <!-- 订单备注 -->
        <div class="view-body">
            <!-- 输入框 -->
            <section>
                <textarea placeholder="填写额外对餐厅或骑手小哥备注的信息"
                v-model="text" maxlength="100"></textarea>
                <!-- 遍历单选数组 -->
                <div class="switch">
                    <span :class="{'selected': item.select}" 
                    @click="handleRadioItem(item)"
                    class="switch-item item-line" 
                    v-for="(item, index) in radioItem" 
                    :key="index">{{ item.name }}</span>
                </div>
                <!-- 遍历多选数组 -->
                <div class="switch" v-for="(item, index) in switchItem" :key="index">
                    <!-- 点击时对选中属性进行取反，为 true 时添加选中样式 -->
                    <span :class="{'selected': item.select}" @click="item.select = !item.select" class="switch-item">{{ item.name }}</span>
                </div>
            </section>
            <!-- 确定按钮 -->
            <!-- 点击时获取到所有选中的标签加上自定义的备注信息 -->
            <button @click="submitClick" class="btn-submit">确定</button>

        </div>
    </div>



</template>


<script>
// 引入 Header 组件构建头部
import Header from '../../components/Header'
export default {
    name: "Remark",
    data() {
        return {
            radioItem: [    // 单选数据
                {select: false, name: '不要辣'},
                {select: false, name: '少点辣'},
                {select: false, name: '多点辣'}
            ],
            switchItem: [   // 多选数据
                {select: false, name: '不要香菜'},
                {select: false, name: '不要洋葱'},
                {select: false, name: '多点醋'},
                {select: false, name: '多点葱'}
            ],
            text: ''    // 输入的备注文本
        }
    },
    components: {
        // 注册组件
        Header
    },
    methods: {
        handleRadioItem(item) {
            // 单选处理
            // item 就是当前点的那个标签
            // 先遍历单选数组，把所有的选中属性都设置 false
            this.radioItem.forEach(element => {
                element.select = false;
            });
            // 再将当前点击的元素的选中属性设为 true
            item.select = true;
        },
        submitClick() {
            // 确定按钮事件
            // 先定义一个空字符串，便于之后的值附加上来
            let selectItems = "";
            // 遍历单选和多选数组，将数组中 select 属性为 true 的添加到结果中
            this.radioItem.forEach(item => {
                if (item.select) {
                    // 当前的项是选中的
                    selectItems += item.name + "，";
                }
            });
            this.switchItem.forEach(item => {
                if (item.select) {
                    // 当前的项是选中的
                    selectItems += item.name + '，';
                }
            });
            // 将自定义的备注信息附加到结果
            selectItems += this.text;
            // console.log(selectItems);
            // 将结果存储到 vuex 中
            this.$store.dispatch('setRemarkInfo', {
                tableware: this.$store.getters.remarkInfo.tableware,
                remark: selectItems
            });

            // 返回上一路由
            this.$router.go(-1);
        }
    }

}
</script>




<style scoped>
.remark {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.view-body {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  font-size: 0.8rem;
  color: #333;
}
.view-body section {
  margin-top: 2.133333vw;
  padding: 4.266667vw;
  background-color: #fff;
  margin-bottom: 2.133333vw;
}
.view-body section textarea {
  width: 100%;
  height: 29.866667vw;
  margin-bottom: 4.266667vw;
  padding: 4.266667vw;
  border: 1px solid #ccc;
  border-radius: 0.666667vw;
  background-color: #f9f9f9;
  color: #666;
  resize: none;
  box-sizing: border-box;
  outline: none;
}
.switch {
  display: inline-block;
  margin: 0 2.666667vw 2.666667vw 0;
  border: 1px solid #ddd;
  overflow: hidden;
  border-radius: 1.066667vw;
}
.switch-item {
  display: inline-block;
  padding: 0 2.133333vw;
  height: 8vw;
  line-height: 8vw;
  text-align: center;
  color: #666;
}
.item-line::after {
  content: " ";
  display: inline-block;
  height: 4vw;
  width: 1px;
  background: #ddd;
  line-height: 8vw;
  vertical-align: middle;
  left: 2.266667vw;
  position: relative;
}
.btn-submit {
    border: none;
  display: block;
  padding: 3.466667vw 0;
  color: #fff;
  background-color: #00e067;
  border-radius: 0.533333vw;
  opacity: 0.98;
  width: 92vw;
  margin: 3.133333vw auto 0;
  font-size: 1rem;
}

/* 选中样式 */
.switch-item.selected {
  background: #0186ff;
  color: #fff;
  position: relative;
}
</style>
