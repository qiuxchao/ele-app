<template>
  <!-- 结算（确认订单）页面 -->

  <div class="settlement">
    <Header :isLeft="true" title="确认订单" @changeRouter="$router.go(-1)" />
    
    <!-- 内容区 -->
    <div class="view-body" v-if="orderInfo">
      	<div class="main">
          <!-- 收货地址 -->
          <section class="cart-address">
            <p class="title">
              订单配送至
              <!-- 右侧标签（家、公司、学校），判断是否拿到地址对象并且有tag属性 -->
              <span class="address-tag" v-if="userInfo && userInfo.tag">{{ userInfo.tag }}</span>
            </p>
            <p class="address-detail">
              <!-- v-if 判断是否有地址数据，展示地址和门牌号 -->
              <span @click="$router.push('/myAddress')" v-if="userInfo">{{ userInfo.address }}{{ userInfo.bottom }}</span>
              <!-- v-else 没有地址数据，显示 选择收货地址或新增收货地址 -->
              <span v-else>
                <!-- v-if 如果有地址，显示选择收货地址 -->
                <span v-if="haveAddress" @click="$router.push('/myAddress')">选择收货地址</span>
                <!-- @click 跳转到添加地址组件 -->
                <!-- v-else 没地址，显示新增收货地址 -->
                <span v-else @click="addAddress">新增收货地址</span>
              </span>
              <!-- 右箭头图标 -->
              <i class="fa fa-angle-right"></i>
            </p>
            <!-- 收货人名字、性别和手机号 -->
            <h2 class="address-name" v-if="userInfo">
              <span>{{ userInfo.name }}</span>
              <span v-if="userInfo.sex">（{{ userInfo.sex }}）</span>
              <span class="phone">{{ userInfo.phone }}</span>
            </h2>
          </section>

          <!-- 送达时间 -->
          <!-- 使用计算属性拿到的 vuex 中的订单信息中的商家信息（里面有送达时间） -->
          <!-- 调用送达时间组件，并把获取到的商家信息传过去 -->
          <Delivery  :shopInfo="orderInfo.shopInfo" />

          <!-- 点餐内容 -->
          <!-- 调用点餐内容组件，并把商家信息订单信息和订单总价传过去 -->
          <CartGroup :orderInfo="orderInfo" :totalPrice="totalPrice" />

			<!-- 备注信息 -->
			<!-- 引入三个订单备注组件，传入标题和子标题 -->
			<section class="checkout-section">
				<!-- 点击餐具份数时打开选择餐具组件的开关 -->
				<CartItem @click="showTableware = true" title="餐具份数" :subHead="remarkInfo.tableware || '未选择'" />
				<!-- 点击订单备注后跳转到 Remakr 组件 -->
				<CartItem @click="$router.push('/remark')" title="订单备注" :subHead="remarkInfo.remark || '口味 偏好'" />
				<CartItem title="发票信息" subHead="不需要开发票" />
			</section>
        
			<!-- 显示 Tableware（餐具选择） -->
			<!-- 传入开关布尔值，右上角关闭按钮事件把开关关闭 -->
			<Tableware :isShow="showTableware" @close="showTableware = false" />

		</div>
	</div>

	<!-- 底部支付按钮 -->
	<footer class="action-bar">
		<!-- 左侧总价 -->
		<span>¥{{ totalPrice }}</span>
		<!-- 右侧去支付按钮 -->
		<button @click="handlePay()">去支付</button>
	</footer>
  </div>
</template>


<script>
// 引入 Header 组件构建头部
import Header from "../../components/Header";
// 引入 Delivery 组件展示送达时间
import Delivery from "../../components/Orders/Delivery"
// 引入 CartGroup 点餐内容组件
import CartGroup from "../../components/Orders/CartGroup"
// 引入 CartItem 订单备注组件
import CartItem from "../../components/Orders/CartItem"
// 引入 Tableware 餐具选择组件
import Tableware from "../../components/Orders/Tableware"
// 引入 Mint-ui 的提示功能
import { Toast } from "mint-ui";
export default {
  name: "Settlement",
  data() {
    return {
      haveAddress: false, // 显示已有地址列表的开关
      showTableware: false      // 显示选择餐具组件的开关
    };
  },
  components: {
    // 注册组件
    Header,
    Delivery,
    CartGroup,
    CartItem,
    Tableware
  },
  beforeRouteEnter(to, from, next) {
    // 进入该页面的路由后先判断是否已经拿到 vuex 中已选择的地址数据
    next(vm => {
      if (!vm.userInfo) {
          // 当前没有从 vuex 中拿到已选择的地址数据
          // 发送请求，获取已有地址列表数据
        vm.getData();
      }
    });
  },
  computed: {
    userInfo() {
      // 从 vuex 中拿到选择的地址数据
      return this.$store.getters.userInfo;
    },
    orderInfo() {
        // 从 vuex 中拿到订单数据
        return this.$store.getters.orderInfo;
    },
    totalPrice() {
        // 从 vuex 中拿到订单总价
        return this.$store.getters.totalPrice;
    },
    remarkInfo() {
        // 从 vuex 中拿到备注信息
        return this.$store.getters.remarkInfo;
    }
  }, 
  methods: {
    addAddress() {
      // 新增收货地址，点击后跳转到添加地址组件
      // 将添加地址页面需要展示的信息通过路由传递过去
      this.$router.push({
        name: "addAddress",
        params: {
          title: "添加地址",
          addressInfo: {
            // 表单数据，要 Post 到接口的对象
            tag: "", // 选中的地址标签
            sex: "", // 选择的性别标签
            address: "", // 选择的地址，由搜索地址组件赋值
            name: "", // 收货人姓名
            phone: "", // 收货人电话
            bottom: "" // 门牌号
          }
        }
      });
    },
    getData() {
      // 获取已有地址列表数据
      this.$axios(`/api/user/user_info/${localStorage.ele_login}`).then(res => {
        // console.log(res.data);
        // 判断是否已有地址
        if (res.data.myAddress.length > 0) {
          // 有地址，打开显示已有地址开关
          this.haveAddress = true;
        } else {
          // 没有地址，关闭显示地址开关
          this.haveAddress = false;
        }
      });
	},
	handlePay() {
		// 去支付按钮事件
		if (!this.userInfo) {
			// 没有选择收货地址
			Toast({
				message: "请选择收货地址",
				position: "bottom",
				duration: 2000
			});
		return;
		}
		// 跳转到支付页面
		this.$router.push('/pay');
	}
  }
};
</script>

<style scoped>
.settlement {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 44px;
}

.view-body {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  font-size: 0.9rem;
  color: #333;
  padding-bottom: 14.133333vw;
  padding-left: 1.6vw;
  padding-right: 1.6vw;
  background-image: linear-gradient(
      0deg,
      #f5f5f5,
      #f5f5f5 65%,
      hsla(0, 0%, 96%, 0.3) 75%,
      hsla(0, 0%, 96%, 0)
    ),
    linear-gradient(270deg, #009eef, #009eef);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.cart-address {
  background-color: transparent;
  padding: 4.266667vw 2.133333vw 2.933333vw 2.133333vw;
  min-height: 22.133333vw;
  color: #fff;
  overflow: hidden;
}
.cart-address .title {
  font-size: 0.9rem;
  line-height: 1.21;
  color: hsla(0, 0%, 100%, 0.8);
}
.cart-address .address-detail {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.88;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.address-detail > span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 4vw);
}
.address-detail > i {
  margin-left: 2.133333vw;
}

/* 显示送货地址 */
.address-name {
  font-size: 0.86rem;
  line-height: 1.21;
  margin-bottom: 1.333333vw;
}
.address-name .phone {
  margin-left: 2.133333vw;
}
.address-tag {
  border: 0.133334vw solid hsla(0, 0%, 100%, 0.8);
  margin-left: 1.6vw;
  display: inline-block;
  padding: 0.533333vw;
  white-space: nowrap;
  border-radius: 0.133333vw;
  font-size: 0.6rem !important;
  line-height: 2.666667vw;
}

.checkout-section {
  margin-bottom: 2.133333vw;
  padding: 0 5.333333vw;
  background: #fff;
  box-shadow: 0 0.133333vw 0.266667vw 0 rgba(0, 0, 0, 0.05);
}

/* 底部支付样式 */
.action-bar {
  height: 11.733333vw;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #3c3c3c;
  z-index: 2;
}
.action-bar > span {
  color: #fff;
  font-size: 1.2rem;
  line-height: 11.733333vw;
  padding-left: 2.666667vw;
  vertical-align: middle;
}
.action-bar > button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #00e067;
  min-width: 28vw;
  padding: 0 1.333333vw;
  border: none;
  color: #fff;
  font-size: 1.2rem;
}
</style>


