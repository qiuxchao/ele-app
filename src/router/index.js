import Vue from 'vue'
// 引入路由
import Router from 'vue-router'
// 引入 Index 主页组件
// import Index from '../views/index'
// 引入 Login 登录组件
// import Login from '../views/Login'

// 使用路由
Vue.use(Router)

  const routes = [
    {
    // 设置根路由为 Index.vue 组件
      path: '/',
    //   name: 'index',
      component: () => import('../views/Index.vue'),  // es 6 import 函数引入文件
      children: [  // 子路由
        {
          path: '',
          redirect: '/home' // 将 index 页面重定向到 home
        },
        {
          path: '/home',
          name: "home",
          component: () => import("../views/Home.vue")
        },
        {
          path: '/order',
          name: 'order',    // 订单组件
          component: () => import("../views/Order.vue")
        },
        {
          path: '/me',
          name: 'me',   // 我的 组件
          component: () => import("../views/Me.vue")
        },
        {
          path: '/address',
          name: 'address',  // 地址组件
          component: () => import('../views/Address.vue')
        },
        {
          path: '/city',
          name: 'city',   // 城市组件
          component: () => import('../views/City.vue')
        }
      ]
    },
    {
      // 设置登录页面路由为 Login.vue 组件
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      // 设置主页搜索页面路由为 Search.vue 组件
      path: "/search",
      name: "search",
      component: () => import('../views/Search.vue')
    },
    {
      // 商家订餐页面路由，组件为 Shop.vue
      path: "/shop",
      name: "shop",
      redirect: "/goods",   // 导航下面默认跳转到子路由 /goods （点餐）
      component: () => import('../views/Shops/Shop.vue'),
      children: [ // 设置 shop 订餐页面的子路由，也就是导航下面对应的三个页面
        {
          path: "/goods", // 点餐
          name: "goods",
          component: () => import('../views/Shops/Goods.vue')
        },
        {
          path: "/comments",  // 评价
          name: "comments",
          component: () => import('../views/Shops/Comments.vue')
        },
        {
          path: "/seller",  // 商家
          name: "seller",
          component: () => import('../views/Shops/Seller.vue')
        }
      ]
    },
    {
      path: "/myAddress",	// 我的地址页面
      name: 'myAddress',
      component: () => import('../views/Orders/MyAddress.vue')
    },
    {
      path: "/addAddress",	// 添加地址页面
      name: 'addAddress',
      component: () => import('../views/Orders/AddAddress.vue')
	  },
	  {
		  path: '/settlement',	// 结算（确定订单）页面
		  name: 'settlement',
		  component: () => import('../views/Orders/Settlement.vue')
	  },
	  {
		  path: '/remark',	// 备注信息页面
		  name: 'remark',
		  component: () => import('../views/Orders/Remark.vue')
	  },
	  {
		  path: '/pay',		// 支付页面
		  name: 'pay',
		  component: () => import('../views/Orders/Pay.vue')
    },
    {
      path: '/orderInfo', // 订单详情页面
      name: 'orderInfo',
      component: () => import('../views/Orders/OrderInfo.vue')
    }
]
const router = new Router({
  routes,
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  mode: "history"
});

// 路由守卫（当在此页面中改变到其他路径都会重新跳转回来）
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.ele_login ? true : false;
  if (to.path == "/login") {
    next();
  } else {
    // 是否在登录状态下
    isLogin ? next() : next("/login");
  }
});


export default router;
