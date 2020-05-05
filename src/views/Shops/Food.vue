<template>
    <!-- 单个商品展示组件 -->
    <transition name="move">
    <div class="food" v-if="isShow">
        <!-- 右上角取消按钮，注册关闭页面事件 -->
        <div class="foodpanel-close" @click="$emit('close')">
            <img src="https://fuss10.elemecdn.com/8/ba/bcfa8cc62b20e044bd2ea1c1c7f3dpng.png?imageMogr/format/webp/" alt="">
        </div>
        <!-- 内容容器 -->
        <div class="foodpanel-body">
            <!-- 商品图片 -->
            <div class="foodpanel-foodimg">
                <img :src="food.image_path" alt="">
            </div>
            <!-- 商品名称、月售、好评率 -->
            <div class="foodpanel-foodinfo">
                <h4>{{ food.name }}</h4>
                <div class="foodpanel-foodsales">
                    <span>月售 {{ food.month_sales }} </span>
                    <span>好评率 {{ food.satisfy_rate }}%</span>
                </div>
                <!-- 商品价格 -->
                <div class="foodpanel-priceLine">
                    <span>¥{{ food.activity.fixed_price }}</span>
                    <CartControl :food="food" class="cart-btn" />
                </div>
                <!-- 商品描述 -->
                <p>{{ food.description }}</p>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>
// 引入小球加减组件
import CartControl from  '../../components/Shops/CartControl'
export default {
    name: "Food",
    props: {
        food: Object,   // 商品信息
        isShow: Boolean // 组件展示开关
    },
    components: {
        // 注册组件
        CartControl
    }
}
</script>

<style scoped>
.food {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
}
.foodpanel-close {
  width: 7.466667vw;
  height: 7.466667vw;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: 2.133333vw;
  right: 4vw;
}
.foodpanel-close img {
  width: 5.333333vw;
  height: 5.333333vw;
}
.foodpanel-body {
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 20vw;
  box-sizing: border-box;
  overflow-x: hidden;
}
.foodpanel-foodimg {
  width: 100%;
  height: 100vw;
  display: block;
}
.foodpanel-foodimg img {
  width: 100%;
  height: 100%;
}
.foodpanel-foodinfo {
  padding: 4vw 4vw 0;
  width: 100%;
  min-height: 29.333333vw;
}
.foodpanel-foodinfo h4 {
  display: flex;
  align-items: center;
  margin-bottom: 2.4vw;
  font-size: 1.2rem;
  font-weight: 700;
  width: 74.666667vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.foodpanel-foodsales {
  font-size: 0.8rem;
  color: #666;
  line-height: 1;
  margin-bottom: 2.4vw;
}
.foodpanel-priceLine {
  display: flex;
  align-items: center;
  margin-bottom: 2.4vw;
  position: relative;
}
.foodpanel-priceLine > span {
  font-size: 1rem;
  line-height: 4.266667vw;
  color: #ff5339;
  padding-bottom: 0.933333vw;
  display: flex;
  align-items: baseline;
}
.foodpanel-priceLine .cart-btn {
  position: absolute;
  right: 8vw;
}
.foodpanel-foodinfo > p {
  font-size: 0.8rem;
  color: #666;
  line-height: 3.733333vw;
  padding-right: 8vw;
}

.move-enter-active,
.move-leave-active {
  transition: all 0.25s ease-in;
  transform: translate(0, -500px);
}

.move-enter,
.move-leave-to {
  transform: translate(0, 500px);
}
</style>














