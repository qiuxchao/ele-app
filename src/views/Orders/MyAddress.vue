<template>
  <!-- 我的地址页面 -->
  <div class="myAddress">
    <!-- 使用 Header 组件构建头部 -->
    <Header :isLeft="true" @changeRouter="$router.go(-1)" :title="title" />

    <!-- 显示已有收货地址 -->
    <div class="address-view">
      <!-- 遍历已有地址列表，拿到每一条地址 -->
      <div class="address-card" v-for="(address, index) in allAddress" :key="index">
        <!-- 对号图标 -->
        <div class="address-card-select">
			<!-- v-if 如果当前选择的地址的下标等于遍历到当前项的下标，就显示对号图标 -->
          <i class="fa fa-check-circle" v-if="selectIndex == index"></i>
        </div>

		<!-- 点击当前一条地址时，将当前地址的数据和下标传到事件函数的参数中 -->
        <div class="address-card-body" @click="setAddressInfo(address, index)">
          <p class="address-card-title">
            <!-- 收货人 -->
            <span class="username">{{ address.name }}</span>
            <!-- 性别，判断有没有填写性别，没有就不展示 -->
            <span v-if="address.sex" class="gender">{{ address.sex }}</span>
            <!-- 电话 -->
            <span class="phone">{{ address.phone }}</span>
          </p>
          <p class="address-card-address">
            <!-- 地址标签，家 || 公司 || 学校 -->
            <span class="tag" v-if="address.tag">{{ address.tag }}</span>
            <!-- 地址文本 -->
            <span class="address-text">{{ address.address }}</span>
          </p>
        </div>

        <!-- 右侧编辑和删除图标 -->
        <div class="address-card-edit">
          <!-- 编辑图标 -->
          <i @click="handleEdit(address)" class="fa fa-edit"></i>
          <!-- 删除图标 -->
          <i @click="handleDelete(address, index)" class="fa fa-close"></i>
        </div>
      </div>
    </div>

    <!-- 底部新增收货地址，点击后跳转到 添加地址组件 -->
    <div class="address-view-bottom" @click="addAddress">
      <!-- 加号图标 -->
      <i class="fa fa-plus-circle"></i>
      <span>新增收货地址</span>
    </div>
  </div>
</template>


<script>
// 引入 Header 组件，构建头部
import Header from "../../components/Header";
export default {
  name: "MyAddress",
  data() {
    return {
      title: "我的地址", // 头部标题
	  allAddress: [], // 所有已添加的地址列表
      selectIndex: 0	// 当前选择的地址的下标
    };
  },
  beforeRouteEnter(to, from, next) {
    // 在每次进入到该页面的路由时调用 getData 请求地址列表数据
    next(vm => vm.getData());
  },
  components: {
    // 注册组件
    Header
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
        // 获取用户地址数据成功，存储到本地
        this.allAddress = res.data.myAddress;
      });
    },
    handleEdit(address) {
      // 编辑按钮事件
      // 把当前的地址信息通过路由传到添加地址组件
      // 跳转到添加地址组件，把头部标题更改为编辑地址
      this.$router.push({
        name: "addAddress",
        params: {
          title: "编辑地址",
          addressInfo: address // address 是遍历时的当前的那条地址信息
        }
      });
    },
    handleDelete(address, index) {
      // 删除按钮事件
      // 发送 delete 请求，需要在接口地址中拼接上用户 Id 和当前地址 id
      this.$axios
        .delete(`/api/user/address/${localStorage.ele_login}/${address._id}`)
        .then(res => {
          // 数据库中删除成功后，本地数组中也要删除
          this.allAddress.splice(index, 1);
        });
	},
	setAddressInfo(address, index) {
		// 点击一条地址时的事件
		// 选中当前的一条地址后，添加对号样式
		this.selectIndex = index;
		// 将 address 对象存储到 vuex，以便于在结算页面显示
		this.$store.dispatch('setUserInfo', address);
		// 跳转到结算组件
		this.$router.push('/settlement');
	}
  }
};
</script>


<style scoped>
.myAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.address-view-bottom {
  position: fixed;
  height: 13.866667vw;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 0.266667vw solid #ddd;
  color: #3190e8;
  font-size: 1rem;
}
.address-view-bottom > i {
  font-size: 1.3rem;
  margin-right: 8px;
}

.address-view {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 13.866667vw;
}
.address-card {
  background-color: #fff;
  padding: 4vw;
  border-bottom: 1px solid #ddd;
  display: flex;
  min-height: 18.133333vw;
}
.address-card-body {
  flex: 1;
  overflow: hidden;
}
.address-card-title {
  font-size: 1rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 1.066667vw;
}
.address-card-title .username {
  color: #333;
  font-weight: 700;
}
.address-card-title .gender {
  padding: 0 1.6vw 0 0.8vw;
}
.address-card-address {
  color: #666;
  font-size: 0.84rem;
  display: flex;
  align-items: center;
}
.address-card-address .tag {
  display: inline-block;
  position: relative;
  margin-right: 0.8vw;
  padding: 0.533333vw;
  color: #ff5722;
  white-space: nowrap;
  border: 1px solid #ff5722;
  border-radius: 0.133333vw;
  font-size: 0.6rem !important;
  line-height: 2.666667vw;
}
.address-text {
  line-height: 4.533333vw;
}

/* 编辑和删除 */
.address-card-edit {
  flex-basis: 13.066667vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.address-card-edit > i {
  color: #aaa;
  font-size: 1.2rem;
}

/*  选中图标 */
.address-card-select {
  flex-basis: 7.333333vw;
  min-width: 7.333333vw;
  display: flex;
  align-items: center;
}
.address-card-select > i {
  font-size: 1.5rem;
  color: #4cd964;
}
</style>



