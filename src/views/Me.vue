<template>
  <!-- 我的 组件 -->
  <!-- html 部分 -->
  <div class="me">
    <!-- 头部登录信息 -->
    <div class="headInfo">
      <!-- 头像图片 -->
      <div class="head-img"></div>
      <!-- 用户 id ，用户电话 / 登录注册，提示信息 -->
      <div class="head-profile">
        <!-- v-if 如果有用户信息，就展示用户 id  -->
        <p class="user-id" v-if="userInfo">{{ userInfo._id }}</p>
        <!-- v-else 没有用户信息就展示登录注册 -->
        <p class="user-id" v-else @click="handleLogin">登录/注册</p>
        <p class="user-phone">
          <i class="fa fa-mobile"></i>
          <!-- v-if 如果用用户信息，就展示用户电话 -->
          <span v-if="userInfo">{{ encryptPhone(userInfo.phone) }}</span>
          <!-- v-else 没有用户信息就展示提示信息 -->
          <span v-else>登陆后享受更多特权</span>
        </p>
      </div>
      <!-- 右箭头 -->
      <i class="fa fa-angle-right"></i>
    </div>

    <!-- 我的地址 和 退出登录按钮 ，v-if 有用户数据才显示-->
    <div v-if="userInfo">
      <div class="address-cell">
        <!-- 位置图标 -->
        <i class="fa fa-map-marker"></i>
        <div class="address-index" @click="myAddress">
          <span>我的地址</span>
          <!-- 右箭头 -->
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <!-- 退出登录按钮 -->
      <button @click="handleLogout" class="loginOut-btn">退出登录</button>
    </div>
  </div>
</template>

<script>
// js 部分
export default {
  name: "me",
  data() {
    return {
      userInfo: "" // 存储用户信息
    };
  },
  beforeRouteEnter(to, from, next) {
    // 一进入到该页面的路由就请求用户数据
    next(vm => vm.getData());
  },
  methods: {
    handleLogin() {
      // 处理登录注册按钮
      // 点击登录注册时跳转到 /login
      this.$router.push("/login");
    },
    getData() {
      // 从 localStorage 中取出用户登录时的 id （在用户登录时已经存入过），
      // 然后使用该用户的 id 请求该用户的数据
      const user_id = localStorage.ele_login;
      this.$axios(`/api/user/user_info/${user_id}`).then(res => {
        // console.log(res.data);
        // 把用户数据存储到 data 中
        this.userInfo = res.data;
      });
    },
    encryptPhone(phone) {
      // 加密手机号码，只显式开头3位和结尾4位
      // 使用正则将中间4位数字替换成 *
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    handleLogout() {
      // 处理退出登录
      // 清空用户信息缓存
      localStorage.removeItem("ele_login");
      // 跳转到登录页面
      this.$router.push("/login");
    },
    myAddress() {
      // 点击我的地址时触发的事件函数
      // 判断当前用户是否有地址
      if (this.userInfo.myAddress.length > 0) {
        // 有地址，跳转到我的地址组件
        this.$router.push("/myAddress");
      } else {
        // 没有地址，跳转到添加地址组件
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
      }
    }
  }
};
</script>

<style scoped>
/* css 部分 */
.me {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.headInfo {
  display: flex;
  background-image: linear-gradient(90deg, #0af, #0085ff);
  padding: 6.666667vw 4vw;
  color: #fff;
  align-items: center;
}
.head-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-position: 0px 120px;
  background-size: 60px;
  background-image: url(https://shadow.elemecdn.com/faas/h5/static/sprite.3ffb5d8.png);
}
.head-profile {
  overflow: hidden;
  margin-left: 4.8vw;
  flex-grow: 1;
}
.head-profile .user-id {
  max-width: 40vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.3rem;
  margin-bottom: 2.133333vw;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.head-profile .user-phone {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}
.user-phone > i {
  margin-right: 0.666667vw;
  font-size: 1rem;
}
.headInfo > i {
  font-size: 1.2rem;
}

.address-cell {
  margin-top: 2.666667vw;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  line-height: 4.533333vw;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding-left: 6.666667vw;
  color: #333;
}
.address-cell > i {
  font-size: 1.3rem;
  color: rgb(74, 165, 240);
  margin-right: 2.666667vw;
}
.address-index {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 3.733333vw 2.666667vw 3.733333vw 0;
  align-content: center;
}
.address-index > i {
  font-size: 1.3rem;
  color: #ccc;
}
.loginOut-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 3.733333vw 0;
  margin: 5.333333vw 0;
  color: #ff5339;
  border-radius: 0.8vw;
  font-size: 1rem;
  font-weight: 700;
  background-color: #fff;
  border: 0;
}
</style>
