<template>
  <!-- 地址组件 点击首页头部地址栏跳转的页面-->
  <!-- html 部分 -->
  <div class="address">
    <!-- 使用 Header 组件构建页面头部 -->
    <!-- changeRouter 事件是需要自定义一个跳转路由的事件函数 -->
    <Header :isLeft="true" title="选择收货地址" @changeRouter="routerChange"/>

    <!-- 搜索框板块 -->
    <div class="city_search">
      <div class="search">
        <!-- 左侧城市文字和下箭头图标 -->
        <!-- 城市文字添加了点击事件，点击时跳转到 city 组件页面 -->
        <span class="city" @click="$router.push('/city')">
          {{city}}
          <i class="fa fa-angle-down"></i>
        </span>
        <!-- 搜索框内的搜索图标 -->
        <i class="fa fa-search"></i>
        <!-- 搜索框 通过 v-model 双向数据绑定到 search_val -->
        <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等">
      </div>
      <!-- 使用 Location 组件构建展示位置展示板块 -->
      <Location @click="selectAddress" :address="address"/>
    </div>
    
    <!-- 遍历获取到的高德搜索提示信息 -->
    <div class="area">
      <ul class="area_list" v-for="(item,index) in areaList" :key="index">
        <li @click="selectAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.district}}{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// js 部分
// 引入 Header 头部组件
import Header from "../components/Header";
// 引入 Location 定位展示组件
import Location from "../components/Location";
export default {
  name: "Address",
  data() {
    return {
      city: "", // 当前的城市
      search_val: "",   // 搜索框内容
      areaList: []  // 高德返回的搜索提示
    };
  },
  computed: {
    address() {
      return this.$store.getters.location.formattedAddress;
    }
  },
  watch: {
    // 监听输入框输入的信息 search_val，调用 searchPlace 显示相应的地点信息
    search_val() {
      this.searchPlace();
    }
  },
  methods: {
    searchPlace() {
      // 使用高德提供的方法处理输入的地址
      const self = this;
      // console.log(this.search_val);
      AMap.plugin("AMap.Autocomplete", function() {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: self.city
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(self.search_val, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(result);
          self.areaList = result.tips;
        });
      });
    },
    selectAddress(item) {
      // 获取地址，并存储到 store 中
      if (item) {
        this.$store.dispatch(
          "setAddress",
          item.district + item.address + item.name
        );
      } else {
        this.$store.dispatch("setAddress", this.address);
      }

      // 跳转到首页
      this.$router.push("/home");
    },
    routerChange() {
      // 使用了在 Header 组件中注册的 changeRouter 事件，当点击 返回 按钮时，将会触发该事件，从而返回到 home 
      this.$router.push('/home');
    }
  },
  components: {
    // 注册组件
    Header,
    Location
  },
  beforeRouteEnter(to, from, next) {
    // 在这里接收路由传递过来的值，都在参数 to  中
    // next 参数表示下一步要做什么，就是将 home 中 或者 city 中传递过来的 city 数据赋给本组件中的 city
    // console.log(to.params.city + "test");
    next(vm => {
      vm.city = to.params.city;
    });
  }
};
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}
.search .city {
  padding: 0 10px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>
