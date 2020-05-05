<template>
  <!-- 购物车组件 -->
  <div class="shopcart">
    <!-- 蒙版，点击购物车并且购物车不为空时才会显示 -->
    <transition name="fade">
      <div
        class="cartview-cartmask"
        @click.self="showCartView = false"
        v-if="showCartView && !isEmpty"
      >
        <!-- 购物车中的商品列表 -->
        <div class="cartview-cartbody">
          <!-- 头部标题和清空按钮 -->
          <div class="cartview-cartheader">
            <!-- 左边已选商品标题 -->
            <span>已选商品</span>
            <!-- @click 点击清空购物车时，把所有商品的数量修改为 0 -->
            <button @click="clearFoods">
              <!-- 右边垃圾桶图标 -->
              <i class="fa fa-trash-o"></i>
              <span>清空</span>
            </button>
          </div>

          <!-- 购物车中展示的每条商品 -->
          <div class="entityList-cartbodyScroller">
            <ul class="entityList-cartlist">
                <!-- 遍历购物车商品列表，拿到每一个商品并展示出来 -->
              <li v-for="(food, index) in selectorFoods" :key="index" class="entityList-entityrow">
                <h4>
                    <!-- 商品名字 -->
                  <span>{{ food.name }}</span>
                </h4>
                <!-- 商品价格 -->
                <span class="entityList-entitytotal">{{ food.activity.fixed_price }}</span>
                <!-- 价格右边调用小球加减组件，控制商品的数量 -->
                <CartControl :food="food" />
              
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- 底部购物车部分 -->
    <div class="bottomNav-cartfooter" :class="{'bottomNav-carticon-empty': isEmpty}">
      <!-- 左边购物车图标和商品数量 -->
      <!-- @click 点击购物车时显示或隐藏购物车商品列表 -->
      <span class="bottomNav-carticon" @click="showCartView = !showCartView">
        <i class="fa fa-cart-plus"></i>
        <!-- 购物车商品数量，有值才显示 -->
        <span v-if="totalCount">{{ totalCount }}</span>
      </span>

      <!-- 图标右侧的描述信息 -->
      <!-- @click 点击购物车右边的区域时显示或隐藏购物车商品列表 -->
      <div class="bottomNav-cartInfo" @click="showCartView = !showCartView">
        <p class="bottomNav-carttotal">
          <!-- 判断是否添加了商品 -->
          <span v-if="isEmpty">未选购商品</span>
          <span v-else>¥{{ totalPrice.toFixed(2) }}</span>
        </p>
        <p class="bottomNav-cartdelivery">另需配送费 {{ shopInfo.rst.float_delivery_fee }} 元</p>
      </div>

      <!-- 右边结算按钮 -->
      <button class="submit-btn">
        <!-- 判断是否添加了商品 -->
        <span v-if="isEmpty">¥{{ shopInfo.rst.float_minimum_order_amount }}起送</span>

        <span @click="settlement" v-else>去结算</span>
      </button>
    </div>
  </div>
</template>



<script>
// 引入加减数量小球组件
import CartControl from '../../components/Shops/CartControl'
export default {
  name: "ShopCart",
  data() {
    return {
      totalCount: 0, // 购物车中商品的数量
      totalPrice: 0, // 购物车中商品的总价格
      selectorFoods: [], // 购物车中的商品
      showCartView: false // 购物车商品列表开关
    };
  },
  components: {
      // 注册组件
      CartControl
  },
  props: {
    // 接收数据
    shopInfo: Object
  },
  computed: {
    isEmpty() {
      // 判断是否没有添加商品，默认为 true
      let empty = true;

      // 初始化购物车中的商品数量、价格和商品列表
      this.totalCount = 0;
      this.totalPrice = 0;
      this.selectorFoods = [];

      // 遍历商家推荐商品列表，查看每一个商品的数量是否大于 0
      // 如果大于 0，就是添加了商品，empty 的值就为 false
      // 然后就改变购物车的样式
      this.shopInfo.recommend.forEach(recommend => {
        recommend.items.forEach(item => {
          if (item.count) {
            empty = false;
            // 把商品数量加入到购物车中
            this.totalCount += item.count;
            // 把商品的价格加入到购物车中
            this.totalPrice += item.activity.fixed_price * item.count;
            // 把商品信息加入到购物车商品数组中
            this.selectorFoods.push(item);
          }
        });
      });

      // 遍历商品列表，查看每一个商品的数量是否大于 0
      // 如果大于 0，就是添加了商品，empty 的值就为 false
      // 然后就改变购物车的样式
      this.shopInfo.menu.forEach(menu => {
        menu.foods.forEach(food => {
          if (food.count) {
            empty = false;
            // 把商品数量加入到购物车中
            this.totalCount += food.count;
            // 把商品价格加入到购物车中
            this.totalPrice += food.activity.fixed_price * food.count;
            // 把商品信息加入到购物车商品数组中
            this.selectorFoods.push(food);
          }
        });
      });

      return empty;
    }
  },
  methods: {
      clearFoods() {
          // 清空购物车方法
          // 遍历商检推荐商品列表，清空所有商品数量
          this.shopInfo.recommend.forEach(recommend => {
              recommend.items.forEach(item => {
                  item.count = 0;
              });
          });
            // 遍历商品列表清空所有商品数量
            this.shopInfo.menu.forEach(menu => {
              menu.foods.forEach(food => {
                  food.count = 0;
              });
          });
      },
      settlement() {
        // 去结算按钮事件
        // 将购物车里面数据存储到 vuex 中
        this.$store.dispatch('setOrderInfo', {
          shopInfo: this.shopInfo.rst,
          selectFoods: this.selectorFoods
        });
        // 跳转到结算组件
        this.$router.push('/settlement');
      }
  }
};
</script>


<style scoped>
.bottomNav-cartfooter {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 21.066667vw;
  background-color: rgba(61, 61, 63, 0.9);
  height: 12.8vw;
  z-index: 1000;
}

.bottomNav-carticon {
  position: absolute;
  left: 3.2vw;
  bottom: 2vw;
  width: 13.333333vw;
  height: 13.333333vw;
  box-sizing: border-box;
  border-radius: 100%;
  background-color: #3190e8;
  border: 1.333333vw solid #444;
  box-shadow: 0 -0.8vw 0.533333vw 0 rgba(0, 0, 0, 0.1);
}
.bottomNav-carticon > i {
  position: absolute;
  top: 7px;
  right: 0;
  bottom: 0;
  left: 7px;
  color: #fff;
  font-size: 1.6rem;
}
.bottomNav-cartInfo {
  flex: 1;
}
.bottomNav-carttotal {
  font-size: 0.8rem;
  line-height: normal;
  color: #fff;
}
.bottomNav-cartdelivery {
  color: #999;
  font-size: 0.6rem;
}
.submit-btn {
  height: 100%;
  width: 28vw;
  background-color: #38ca73;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 12.8vw;
  border: none;
  outline: none;
}

.bottomNav-carticon-empty > span {
  background-image: radial-gradient(circle, #363636 6.266667vw, #444 0);
}
.bottomNav-carticon-empty > span > i {
  color: #606065 !important;
}
.bottomNav-carticon-empty .bottomNav-carttotal > span {
  color: #999;
}
.bottomNav-carticon-empty .submit-btn {
  background-color: #535356 !important;
}

.bottomNav-carticon > span {
  position: absolute;
  right: -1.2vw;
  top: -1.333333vw;
  line-height: 1;
  background-image: linear-gradient(-90deg, #ff7416, #ff3c15 98%);
  color: #fff;
  border-radius: 3.2vw;
  padding: 0.833333vw 1.333333vw;
  font-size: 0.6rem;
}

.cartview-cartmask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 200;
}
.cartview-cartbody {
  position: fixed;
  left: 0;
  width: 100%;
  background-color: #fff;
  bottom: 12.8vw;
  z-index: 201;
  opacity: 1;
  font-size: 1rem;
}
.cartview-cartheader {
  display: flex;
  align-items: center;
  padding: 0 4vw;
  border-bottom: 0.133333vw solid #ddd;
  background-color: #eceff1;
  color: #666;
  height: 10.666667vw;
}
.cartview-cartheader > span {
  flex: 1;
  display: flex;
  align-items: center;
}
.cartview-cartheader > button {
  border: none;
  outline: none;
  flex: none;
  display: flex;
  align-items: center;
  padding-left: 4vw;
  color: #666;
  text-decoration: none;
  font-size: 0.8rem;
  line-height: 4vw;
  background: none;
}
.cartview-cartheader > button > span {
  margin-left: 0.8vw;
}
.entityList-cartbodyScroller {
  overflow: auto;
  max-height: 80vw;
}
.entityList-entityrow {
  border-bottom: 0.133333vw solid #eee;
  display: flex;
  align-items: center;
  padding: 2vw 3.333333vw 2vw 0;
  min-height: 12.666667vw;
  margin-left: 3.333333vw;
}
.entityList-entityrow > h4 {
  flex: 5.5;
  line-height: normal;
}
.entityList-entityrow > h4 > span {
  display: inline-block;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  max-width: 46.666667vw;
}
.entityList-entitytotal {
  color: rgb(255, 83, 57);
  flex: 2.5;
  text-align: left;
  white-space: nowrap;
  font-weight: 700;
}
.entityList-entitytotal::before {
  content: "\A5";
  font-size: 0.6rem;
  color: currentColor;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>






