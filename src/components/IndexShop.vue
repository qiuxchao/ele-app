<template>
    <!-- 展示一条商家信息 -->
    <section class="index-container">
        <!-- 点击每一条商家信息都会跳转到订餐组件页面 -->
        <div class="index-shopInfo" @click="$router.push('/shop')">
            <!-- 左侧图片 -->
            <div class="logo_container">
                <img :src="restaurant.image_path" alt="">
            </div>

            <!-- 右侧内容 -->
            <div class="index_main">
                <!-- 第一行 品牌 -->
                <div class="index_shopname">
                    <!-- 判断是否有品牌，有就显示，没有则不显示 -->
                    <i v-if="restaurant.is_premium">品牌</i>
                    <span>{{ restaurant.name }}</span>
                </div>

                <!-- 第二行 星级 -->
                <div class="index-rateWrap">
                    <div>
                        <!-- 调用评分组件，传入评分 -->
                        <Rating :rating="restaurant.rating" />
                        <!-- 评分数值 x.x -->
                        <span class="rate">{{ restaurant.rating }}</span>
                        <!-- 月售 x 单 -->
                        <span>月售{{ restaurant.recent_order_num }}单</span>
                    </div>
                    <!-- 判断是否有蜂鸟专送标签，有就显示，没有则不显示 -->
                    <div class="delivery" v-if="restaurant.delivery_mode">
                        <span class="icon-hollow">{{ restaurant.delivery_mode.text }}</span>
                    </div>
                </div>

                <!-- 第三行 配送 -->
                <div class="index-moneylimit">
                    <!-- 满多少起送，配送费 -->
                    <div>
                        <span>¥{{ restaurant.float_minimum_order_amount }}起送</span>
                        |
                        <span>配送费¥{{ restaurant.float_delivery_fee }}</span>
                    </div>
                    <!-- 配送距离 和 预计时间 -->
                    <div class="index-distanceWrap">
                        <!-- 把距离数除以 1000 ，然后保留两位小数，以便于使用 km 单位显示 -->
                        <span>{{ (restaurant.distance / 1000).toFixed(2) }}km</span>
                        |
                        <span>{{ restaurant.order_lead_time }}分钟</span>
                    </div>

                </div>

            </div>

        </div>
    </section>  

</template>

<script>
// 引入评分组件
import Rating from './Rating'
export default {
    name: "IndexShop",
    props: {
        restaurant: Object
    },
    components: {
        // 注册组件
        Rating
    }
};
</script>

<style scoped>
.index-container {
  background: #fff;
  color: #666;
  padding: 4vw 0;
  border-bottom: 0.133333vw solid #eee;
}
.index-shopInfo {
  display: flex;
  justify-content: flex-start;
  padding: 0 2.666667vw;
  align-items: stretch;
}
.logo_container {
  width: 17.333333vw;
  height: 17.333333vw;
}
.logo_container img {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 0.133333vw solid rgba(0, 0, 0, 0.08);
  border-radius: 0.533333vw;
}
.index_main {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  flex-direction: column;
  padding-left: 2.666667vw;
  font-size: 0.2rem;
  flex-grow: 1;
}
.index_shopname {
  align-items: center;
  color: #333;
  font-weight: 700;
  font-size: 0.9rem;
}
.index_shopname i {
  background: #ffe800;
  margin-right: 1.333333vw;
  padding: 0.266667vw 0.666667vw;
  text-align: center;
  white-space: nowrap;
  font-size: 0.6rem;
}
.index_shopname span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-rateWrap {
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
}

.index-rateWrap .rate {
  margin-right: 1.066667vw;
}
.index-moneylimit {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.index-moneylimit .index-distanceWrap {
  color: #999;
}
.delivery {
  display: flex;
  align-items: center;
  font-size: 0.6rem;
  margin-left: 1.066667vw;
}
.delivery .icon-hollow {
  color: #fff;
  background-color: #2395ff;
  padding: 2px;
  box-sizing: border-box;
}
</style>