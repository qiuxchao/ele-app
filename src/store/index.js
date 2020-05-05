import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// types
const types = {
  // 设置了 type ，能在浏览器的 Vue 控制台中看到
  SET_LOCATION: "SET_LOCATION",   // 通过高德API获取到的城市或省份数据
  SET_ADDRESS: "SET_ADDRESS",       // 通过高德API获取到的位置数据
  ORDER_INFO: "ORDER_INFO",            // 购物车里的商品数据
  USER_INFO: "USER_INFO",                 // 在我的地址里面选中的地址数据
  REMARK_INFO: "REMARK_INFO"        // 订单备注数据                   
}
//

// state
const state = {
  location: {},   // 通过高德API获取到的城市或省份数据
  address: "",    // 通过高德API获取到的位置数据
  orderInfo: null,    // 购物车里的商品数据
  userInfo: null,     // 在我的地址里面选中的地址数据
  remarkInfo: {     // 订单备注数据
    tableware: '',    // 餐具份数
    remark: '',       // 备注信息
  }
}

// getters
const getters = {
  location: state => state.location,  // 通过高德API获取到的城市或省份数据
  // 等价于
  // location(state) {
  //   return state.location;
  // },
  address: state => state.address,  // 通过高德API获取到的位置数据
  orderInfo: state => state.orderInfo,    // 购物车里的商品数据
  userInfo: state => state.userInfo,       // 在我的地址里面选中的地址数据
  totalPrice: state => {  // 购物车中的商品总价 + 配送费
    let price = 0;
    if (state.orderInfo) {
      // 拿到商品列表
      const selectFoods = state.orderInfo.selectFoods;
      // 遍历商品列表，把每一个商品的价格附加到 price
      selectFoods.forEach(food => {
        // 商品价格 = 商品单价 + 商品数量
        price += (food.activity.fixed_price * food.count);
      });
      // 加完所有的商品价格再加上配送费
      price += state.orderInfo.shopInfo.float_delivery_fee;
    }
    // 返回总价
    return price;
  },
  remarkInfo: state => state.remarkInfo,  // 订单备注数据

}

// mutations
const mutations = {
  [types.SET_LOCATION](state, location) {  // 通过高德API获取到的城市或省份数据
    if (location) {
      state.location = location;
    } else {
      state.location = null;
    }
  },
  [types.SET_ADDRESS](state, address) { // 通过高德API获取到的位置数据
    if (address) {
      state.address = address;
    } else {
      state.address = null;
    }
  },
  [types.ORDER_INFO](state, orderInfo) {    // 购物车里的商品数据
    if (orderInfo) {
      state.orderInfo = orderInfo;
    } else {
      state.orderInfo = null;
    }
  },
  [types.USER_INFO](state, userInfo) {    // 在我的地址里面选中的地址数据
    if(userInfo) {
      state.userInfo = userInfo;
    } else {
      state.userInfo = null;
    }
  },
  [types.REMARK_INFO](state, remarkInfo) {    // 订单备注数据
    if (remarkInfo) {
      state.remarkInfo = remarkInfo;
    } else {
      state.remarkInfo = null;
    }
  }
}

// actions
const actions = {
  setLocation: ({ commit }, location) => {  // 通过高德API获取到的城市或省份数据
    commit(types.SET_LOCATION, location);
  },
  setAddress: ({ commit }, address) => {  // 通过高德API获取到的位置数据
    commit(types.SET_ADDRESS, address);
  },
  setOrderInfo: ({ commit }, orderInfo) => {    // 购物车里的商品数据
    commit(types.ORDER_INFO, orderInfo);
  },
  setUserInfo: ({ commit }, userInfo) => {        // 在我的地址里面选中的地址数据
    commit(types.USER_INFO, userInfo);
  },
  setRemarkInfo: ({ commit }, remarkInfo) => {        // 订单备注数据
    commit(types.REMARK_INFO, remarkInfo);
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
