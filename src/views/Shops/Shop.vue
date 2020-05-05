<template>
    <!-- 订餐页面 - 点击商家列表中的某个商家后跳转的页面 -->

    <!-- html 部分 -->
    <!-- v-if 有数据才会显示 -->
  <div class="shop" v-if="shopInfo">

      <!-- 头部背景图片 -->
      <nav class="header-nav">
          <div class="nav_bg">
              <img :src="shopInfo.rst.scheme" alt="">
          </div>

            <!-- 左上角返回图标 -->
          <div class="nav_back">
              <!-- 点击返回图标返回到 home  -->
              <i class="fa fa-chevron-left" @click="$router.push('/home')"></i>
          </div>

            <!-- 中间商家logo图片 -->
          <div class="shop_image">
              <img :src="shopInfo.rst.image_path" alt="">
          </div>
      </nav>

     <!-- 商家标题，位于商家logo下方  -->
     <!-- 点击后有弹窗 -->
     <div class="index-rst">
         <div class="rst-name">
             <!-- title 文字 -->
             <span @click="showInfoModel = true">{{ shopInfo.rst.name }}</span>
             <!-- 文字右边 右箭头 -->
             <i class="fa fa-caret-right"></i>
         </div>

        <!-- 调用弹窗组件并把商家信息传过去，并把显示或隐藏的属性传过去 -->
        <!-- 接收事件 close ，当点击弹窗的 x 号时设置关闭弹窗 -->
        <InfoModel @close="showInfoModel = false" :rst="shopInfo.rst" :showInfoModel="showInfoModel" />

        <!-- 商家标题下方，评分、月售、蜂鸟专送 信息 -->
        <div class="rst-order">
            <span>评分{{ shopInfo.rst.rating }}</span>
            <span>月售{{ shopInfo.rst.recent_order_num }}单</span>
            <span>蜂鸟专送约{{ shopInfo.rst.order_lead_time }}分钟</span>
        </div>

        <!-- 优惠信息 -->
        <!-- 调用优惠信息组件并把数据传过去 -->
        <Activity :activities="shopInfo.rst.activities" />

        <!-- 公告 -->
        <p class="rst-promotion">公告：{{ shopInfo.rst.promotion_info }}</p>
     </div>

    <!-- 中间导航，使用 NavBar 组件 -->
    <NavBar />

    <!-- keep-alive 缓存三个组件的数据 -->
    <keep-alive>
      <!-- 点击导航中的路由时，跳转的页面在下面 router-view 中呈现 -->
      <router-view></router-view>
    </keep-alive>

  </div>
</template>

<script>
// js 部分
// 引入 title 弹窗组件
import InfoModel from '../../components/Shops/InfoModel'
// 引入优惠信息组件 
import Activity from '../../components/Shops/Activity'
// 引入 NavBar 导航组件
import NavBar from '../../components/Shops/NavBar'
export default {
    name: "Shop",
    data() {
        return {
            shopInfo: null,  // 订餐信息
            showInfoModel: false  // 是否显示 title 弹窗，默认不显示
        }
    },
    created() {
        // 在页面加载后请求订餐信息
        this.getData();
    },
    methods: {
        getData() {
            // 请求订餐数据
            this.$axios("/api/profile/batch_shop")
                .then(res => {
                    // console.log(res.data);
                    // 存储数据到 data 中
                    this.shopInfo = res.data;
                })
                .catch(err => {
                    console.error(err);
                });
        }
    },
    components: {
        // 注册组件
        InfoModel,
        Activity,
        NavBar
    }
};
</script>

<style scoped>
/* css 部分 */
.shop {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header-nav {
  position: relative;
}
.nav_bg img {
  width: 100%;
  height: 26.666667vw;
}
.nav_back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 26.666667vw;
  background: rgba(0, 0, 0, 0.5);
}
.nav_back i {
  color: #fff;
  font-size: 1.3rem;
  margin-left: 1.333333vw;
  margin-top: 1.333333vw;
}
.shop_image {
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -10vw;
  margin-top: 11vw;
}
.shop_image img {
  width: 20vw;
  height: 20vw;
  border-radius: 0.8vw;
}

.index-rst {
  padding: 8vw 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  box-shadow: inset 0 -0.666667vw 0.666667vw hsla;
}
.index-rst .rst-name {
  flex: 1;
  width: 72vw;
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
  padding-right: 2.666667vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.6vw 0;
}
.rst-name span {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.index-rst .rst-order {
  white-space: nowrap;
  height: 3.2vw;
  margin-top: 1.733333vw;
  color: #666;
  text-align: center;
  font-size: 0.6rem;
}
.rst-order span {
  margin: 0 3px;
}
.index-rst .rst-promotion {
  width: 80vw;
  font-size: 0.6rem;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 2.266667vw auto 2.666667vw;
  padding: 0;
  white-space: nowrap;
}

</style>
