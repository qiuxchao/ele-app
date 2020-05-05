<template>
    <!-- 订单页面 - 首页第二个子路由 -->

    <!-- html 部分 -->
  <div class="order">

      <div class="order-card-body" v-for="(order, index) in orderlist" :key="index">

          <!-- 先判断当前的项是否有订单信息，再确定是否展示 -->
          <!-- @click 点击此区域跳转到订单详情页面并把当前的order传过去 -->
          <div class="order-card-wrap" v-if="order.orderInfo" @click="$router.push({name: 'orderInfo', params: order})">
              <!-- 商家图片 -->
              <img :src="order.orderInfo.shopInfo.image_path" alt="">
              
              <!-- 商品卡片 -->
              <div class="order-card-content">
                  <!-- 头部信息 -->
                  <div class="order-card-head">
                      <div class="title">
                          <!-- 左侧内容 -->
                          <a>
                              <!-- 商家名字 -->
                              <span>{{ order.orderInfo.shopInfo.name }}</span>
                             <!-- 右箭头图标 -->
                              <i class="fa fa-angle-right"></i>
                          </a>
                          <!-- 右侧内容 -->
                          <p>订单已完成</p>
                      </div>
                      <!-- 订单时间 -->
                      <p class="date-time">{{ order.date }}</p>
                  </div>

                  <!-- 详细信息 -->
                  <div class="order-card-detail">
                      <!-- 第一份商品名 -->
                      <p class="detail">{{ order.orderInfo.selectFoods[0].name }}</p>
                        <!-- 总价格 -->
                      <p class="price">¥{{ order.totalPrice }}</p>
                  </div>

              </div>
          </div>

            <!-- 底部再来一单按钮 -->
          <div class="order-card-bottom"> <!-- v-if="order.orderInfo" -->
              <button class="cardbutton" @click="$router.push('/shop')">再来一单</button>
          </div>


      </div>

  </div>
</template>

<script>
// js 部分
export default {
    name: "order",
    data() {
        return {
            orderlist: []   // 所有订单信息
        };
    },
    beforeRouteEnter(to, from, next) {
        // 一进入该页面的路由就获取所有订单数据
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        getData() {
            // 请求接口，获取所有订单数据
            this.$axios(`/api/user/orders/${localStorage.ele_login}`)
                .then(res => {
                    console.log(res.data);
                    // 将返回的所有订单数据存储到本地
                    this.orderlist = res.data.orderlist;
                })
        }
    }
};
</script>

<style scoped>
.order {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  margin-bottom: 2.666667vw;
}
.order-card-body {
  margin-top: 2.666667vw;
  background-color: #fff;
  padding: 3.733333vw 0 0 4vw;
}
.order-card-wrap {
  display: flex;
}
.order-card-wrap > img {
  height: 8.533333vw;
  border-radius: 0.533333vw;
  border: 1px solid #eee;
  width: 8.533333vw;
  margin-right: 2.666667vw;
}
.order-card-content {
  flex: 1;
}
.order-card-head {
  border-bottom: 1px solid #eee;
  padding-right: 3.466667vw;
  padding-bottom: 2.666667vw;
}
.order-card-head .title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.order-card-head .title > a {
  font-size: 1rem;
  line-height: 1.5em;
  color: #333;
  text-decoration: none;
}
.order-card-head .title > a > span {
  display: inline-block;
  max-width: 10em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order-card-head .title > a > i {
  margin-left: 1.333333vw;
  color: #ccc;
  vertical-align: super;
}
.order-card-head .title > p {
  font-size: 0.8rem;
  text-align: right;
  color: #333;
  max-width: 14em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.date-time {
  font-size: 0.6rem;
  color: #999;
}
.order-card-detail {
  display: flex;
  justify-content: space-between;
  padding: 4vw 3.466667vw 4vw 0;
  font-size: 0.8rem;
}
.order-card-detail .detail {
  color: #666;
  display: flex;
  align-items: center;
}
.order-card-detail .price {
  flex-basis: 16vw;
  text-align: right;
  color: #333;
  font-weight: 700;
}
.order-card-bottom {
  display: flex;
  border-top: 1px solid #eee;
  padding: 2.666667vw 4.266667vw;
  justify-content: flex-end;
}
.cardbutton {
  padding: 1.333333vw 2.666667vw;
  border: 1px solid #2395ff;
  border-radius: 0.533333vw;
  background-color: transparent;
  outline: none;
  font-size: 0.8rem;
  color: #2395ff;
  margin-left: 2vw;
}
</style>

