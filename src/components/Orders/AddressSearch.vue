<template>
  <!-- 地址搜索组件 -->

  <!-- v-if 判断是否显示该组件 -->
  <div v-if="showSearch" class="addressSearch">
    <div class="search-view">
      <div class="search-box">
        <!-- 地址搜索框 -->
        <div class="search-box-input">
          <i class="fa fa-search"></i>
          <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="search_address" />
        </div>

        <!-- 右侧取消按钮 -->
        <!-- 注册了点击事件，在调用组件的地方把showSearch改为false隐藏组件 -->
        <button @click="$emit('close')" class="search-box-btn">取消</button>
      </div>

      <!-- 搜索提示信息 -->
      <ul class="search-list">
          <!-- 遍历高德提示信息列表，拿到每一条信息并展示出来 -->
          <li 
          class="search-row"
          v-for="(item, index) in areaList" :key="index"
          @click="selectAddress(item)"
          >
            <!-- 地址名 -->
            <p class="search-row-title">{{ item.name }}</p>
            <!-- 详细地址：区加街道 -->
            <p class="search-row-location">{{ item.district }}{{ item.address }}</p>
          </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: "AddressSearch",
  data() {
    return {
      search_address: "", // 双向绑定到搜索框
      areaList: [],  // 根据高德获取到的搜索提示信息列表
    };
  },
  watch: {
    // 监听输入框
    search_address(val) {
      // 监听输入框的变化，使用 searchPlace 方法返回对应的提示信息
      // console.log(val);
      this.searchPlace(val);
    }
  },
  props: {
    showSearch: Boolean, // 是否展示搜索页面
    addressInfo: Object  // 接收地址信息
  },
  computed: {
      city() {
          // 将 store 中的城市信息或省份信息拿过来
          return (
            this.$store.getters.location.addressComponent.city  || 
            this.$store.getters.location.addressComponent.province)
        }
  },
  methods: {
    searchPlace(val) {
        // console.log(this.city);
      // 调用高德地图API的输入提示功能
      AMap.plugin("AMap.Autocomplete", () => {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: this.city
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        // val 是搜索的关键词，即搜索框中的东西
        autoComplete.search(val, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据
         //   console.log(result);
         // 将提示地址列表存储到 areaList 中
         this.areaList = result.tips;
        });
      });

    },
    selectAddress(item) {
        // 点击某一条地址提示信息时触发的事件，参数为当前点击的信息
        // console.log(item);
        // 这里给接收的地址对象中的地址信息赋值，这样在传递信息的AddAddress组件中也会发生改变
        // 这种传值方法是可以的，因为当前两个组件在一个路由中，只不过一个显示时，另一个隐藏
        this.addressInfo.address = item.name + item.district + item.address;
        // 选择地址后，关闭该组件
        this.$emit('close');
    }
  }
};
</script>

<style scoped>
.addressSearch {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.search-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #fff;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.133333vw 3.866667vw 1.866667vw;
}
.search-box-input {
  flex: 1;
  border: 1px solid #ddd;
  outline: 0;
  color: #999;
  height: 7.466667vw;
  margin-right: 2.666667vw;
  border-radius: 0.533333vw;
  background: #f5f5f5;
  padding: 0 2.133333vw;
  display: flex;
  align-items: center;
}
.search-box-input > input {
  margin-left: 2vw;
  width: 90%;
  background: none;
}
input,
button {
  outline: none;
  border: none;
}
.search-box-btn {
  color: #333;
  border-radius: 0.533333vw;
  width: 14.8vw;
  height: 7.466667vw;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-list {
  padding-left: 4vw;
}
.search-row {
  border-bottom: 0.266667vw solid #eee;
  padding: 2.533333vw 0 3.333333vw;
  line-height: 1.2;
}
.search-row-title {
  color: #333;
  font-size: 1rem;
}
.search-row-location {
  color: #999;
  font-size: 0.866rem;
}
</style>

























