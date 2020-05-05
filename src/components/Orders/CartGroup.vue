<template>
    <!-- 点餐内容 -->

    <section class="checkout-section cart-group">
        <!-- 商家名称 -->
        <h3>{{ orderInfo.shopInfo.name }}</h3>

        <!-- 展示商品列表 -->
        <ul>
            <!-- 遍历已选择的商品列表，拿到每一个商品并展示出来 -->
            <li v-for="(food, index) in orderInfo.selectFoods" :key="index">
                <!-- 商品图片 -->
                <img :src="food.image_path" alt="">
                <!-- 商品信息 -->
                <div class="cart-group-info">
                    <!-- 商品名 -->
                    <span>{{ food.name }}</span>
                    <!-- 商品数量 -->
                    <span>x {{ food.count }}</span>
                    <!-- 商品单价 -->
                    <span>{{ food.activity.fixed_price }}</span>
                </div>
            </li>

            <!-- 配送费 -->
            <li class="cart-group-total">
                <div>配送费</div>
                <div>¥{{ orderInfo.shopInfo.float_delivery_fee }}</div>
            </li>

            <!-- 价格总计 -->
            <li class="cart-group-total">
                <div class="discounts"></div>
                <div class="subtotal">
                    <span>小计 ¥</span>
                    <span class="price">{{ totalPrice }}</span>
                </div>
            </li>
        </ul>

    </section>

</template>



<script>
export default {
    name: "CartGroup",
    props: {
        orderInfo: Object,  // 订单信息
        totalPrice: Number  // 订单总价
    }


}
</script>



<style scoped>
.checkout-section {
  margin-bottom: 2.133333vw;
  padding: 0 5.333333vw;
  background: #fff;
  box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
}
.cart-group > h3 {
  padding: 4.266667vw 0;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1.1rem;
  line-height: 1;
  font-weight: 700;
}
.cart-group > ul {
  margin-top: 0.666667vw;
  color: #333;
  font-size: 0.9rem;
}
.cart-group > ul > li {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 3.2vw 0;
  border-bottom: 1px dotted #eee;
  color: inherit;
}
.cart-group > ul > li > img {
  width: 9.6vw;
  height: 9.6vw;
}
.cart-group-info {
  margin-left: 2.133333vw;
  overflow: hidden;
  flex: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cart-group-total {
  justify-content: space-between;
  padding: 4vw 0 4.8vw !important;
}
.discounts {
  color: #bbb;
}
.subtotal .price {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>










