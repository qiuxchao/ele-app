<template>
    <!-- 评分组件，通过评分改变星星的样式-->

    <!-- 五颗星星图标 -->
    <div class="Rating-gray">
        <i v-for="(item, index) in itemClass" :key="index" :class="'fa ' + item"></i>
    </div>
</template>



<script>
// 星星长度，最大为五个
const LENGTH = 5;

// 星星对应的 class 样式
// 全星
const CLS_ON = "fa-star";
// 半星
const CLS_HALF = "fa-star-half-empty";
// 补齐（不满足五个星星时，补上空星）
const CLS_OFF = "fa-star-o";

export default {
    name: "Rating",
    props: {
        rating: Number      // 接收传来的评分，数值类型
    },
    computed: {
        itemClass() {
            // 
            // 例如：4.8 分 4个全星 1 个半星
            let result = [];

            // 对分数进行处理，向下取 0.5 的倍数
            // score = Math.floor(4.8 * 2) / 2 = 9 / 2 = 4.5
            let score = Math.floor(this.rating * 2) / 2;
            // 控制半星（有小数的情况）4.5 % 1 = 0.5 !== 0; true
            let hasDecimal = score % 1 !== 0;
            // 全星（整数）    Math.floor(4.5) = 4; 
            let integer = Math.floor(score);

            // 把全星放入到数组中，有几个全星就放几次
            for(let i =0; i < integer; i++) {
                result.push(CLS_ON);
            }

            // 把半星放入到数组中，有半星就放，没有就不放
            if (hasDecimal) {
                result.push(CLS_HALF);
            }

            // 不满足五个星星，使用空星补齐
            while(result.length !== 5) {
                result.push(CLS_OFF);
            }

            // 返回星星数组
            return result;
        }
    }
}
</script>



<style scoped>
.Rating-gray {
  margin-right: 1.066667vw;
  color: #ffbe00;
  display: inline-block;
}
</style>

