<template>
  <!-- 点击主页搜索框后跳转的搜索页面 -->
  <div class="search">
    <!-- 使用 Header 组件构建页面头部 -->
    <!-- changeRouter 事件是需要自定义一个跳转路由的事件函数 -->
    <Header title="搜索" :isLeft="true" @changeRouter="routerChange" />

    <!-- 头部搜索 -->
    <div class="search_header">
      <form class="search_wrap">
        <!-- 搜索图标 -->
        <i class="fa fa-search"></i>
        <!-- 输入框，双向绑定了 key_word 属性 -->
        <input type="text" v-model="key_word" placeholder="输入商家, 商品信息" />
        <!-- 搜索按钮，因为在表单元素内，会有一个默认的 submit 提交事件，所有需要阻止掉 -->
        <button @click.prevent="searchHandle">搜索</button>
      </form>
    </div>

    <!-- 搜索提示信息 -->
    <!-- 使用 v-if 防止二级调用 ，!showShop 在商家信息不显示的时候显示搜索信息-->
    <div class="shop" v-if="result && !showShop">
      <!-- 搜索内容为不可用时显示的提示信息，当 empty 为 false 时展示 -->
      <div class="empty_wrap" v-if="empty">
        <img src="https://fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png" />
        <div class="empty_txt">
          <h4>附近没有搜索结果</h4>
          <span>换个关键词试试吧</span>
        </div>
      </div>

      <!-- 关键词结果显示，当 empty 为 true 时显示 -->
      <div v-else>
        <!-- 调用商家搜索提示信息组件，把获取到的商家信息列表传递过去 -->
        <!-- 点击商家信息跳转到订餐组件页面 -->
        <SearchIndex @listClick="$router.push('/shop')" :data="result.restaurants" />
        <!-- 调用商家搜索提示信息组件，把获取到的关键词列表传递过去 -->
        <SearchIndex @listClick="shopItemClick" :data="result.words" />
      </div>
    </div>

    <!-- 当点击商家列表后，显示排序导航和商家信息 -->
    <div class="container" v-if="showShop">
      <!-- 商家排序导航，使用 FilterView 组件并把获取到的数据传递过去 -->
      <FilterView :filterData="filterData" @update="update" />

      <!-- 商家信息展示，使用 IndexShop 组件 -->
      <!-- v-infinite-scroll mint-ui  无限滚动功能 -->
      <!-- infinite-scroll-disabled 是否加载完了所有数据 -->
      <div class="shoplist" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading">
        <!-- 使用 IndexShop 组件，然后遍历商家列表，把每一条商家数据传递过去  -->
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
      </div>
    </div>
  </div>
</template>


<script>
// 引入 Header 头部组件
import Header from "../components/Header";
// 引入商家搜索信息提示组件
import SearchIndex from "../components/SearchIndex";
// 引入 排序导航组件
import FilterView from "../components/FilterView";
// 引入商家信息展示组件
import IndexShop from "../components/IndexShop";
// 引入 mint-ui 无限滚动功能
import { InfiniteScroll } from "mint-ui";

export default {
  name: "Search",
  data() {
    return {
      key_word: "", // 双向绑定了搜索框
      result: null, // 根据搜索框的关键词返回的提示信息
      empty: false, // 搜索内容是否为空
      showShop: false, // 是否显示商家信息
	  filterData: null, // 存储请求到的数据
	  data: null,	// 排序规则
      restaurants: [], // 存储商家列表
      page: 0, // 请求的页数
      size: 7, // 请求的商家数据条数
      loading: false // 商家信息没有被请求完
    };
  },
  watch: {
    key_word() {
      // 搜索框输入内容时，提示信息隐藏
      this.empty = false;
      // 商家信息隐藏
      this.showShop = false;
      // 监听 key_word 属性的变化，发生变化时，调用 keyWordChange 方法，获取返回信息
      this.keyWordChange();
    }
  },
  created() {
    // 在页面加载后请求到商家信息数据赋给 filterData
    this.$axios("/api/profile/filter").then(res => {
      // console.log(res.data);
      this.filterData = res.data;
    });
  },
  components: {
    // 注册组件
    Header,
    SearchIndex,
    FilterView,
    IndexShop
  },
  methods: {
    routerChange() {
      // 使用了在 Header 组件中注册的 changeRouter 事件，当点击 返回 按钮时，将会触发该事件
      this.$router.push("/home");
    },
    keyWordChange() {
      // 通过搜索框内的关键词请求后端接口，获取返回信息并添加到信息对象中
      // console.log(this.key_word);
      this.$axios(`api/profile/typeahead/${this.key_word}`)
        .then(res => {
          // console.log(res.data);
          this.result = res.data;
        })
        .catch(err => {
          // 请求失败时 result 为空
          this.result = null;
        });
    },
    searchHandle() {
      // 点击搜索按钮时的事件函数

      // 搜索框没有内容，空执行
      if (!this.key_word) return;

      // 搜索框有内容
      // 如果有返回结果并且返回结果的两个数组中的任意一个的长度大于 0
      if (
        this.result &&
        (this.result.restaurants.length > 0 || this.result.words.length > 0)
      ) {
        // 有内容
        // console.log("有内容");
        // 显示商家信息
        this.shopItemClick();
      } else {
        // 没有内容
        // empty 为 true ，显示搜索内容为不可用的提示信息
        this.empty = true;
      }
    },
    shopItemClick() {
      // 点击搜索列表中的任意一项后，初始化数据
      this.page = 0;
      this.restaurants = [];
      this.showShop = true;
    },
    update(condition) {
      // FilterView 组件更新数据调用的函数
      // console.log(condition);
      this.data = condition;
      this.shopItemClick();
    },
    loadMore() {
      console.log(222);
      // 当页面向下滚动的时候触发
      this.page++;
      // 请求商家数据
      // 在 url 中使用属性 page 和 size 来获取商家信息的页数和数据条数
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data)
        .then(res => {
          // console.log(res.data);
		  // 将获取到的商家信息赋给 data 中的 restaurants
		  // 判断后端是否还有数据
		if(res.data.length > 0) {
			// 后端还有数据，遍历数据，把每一条追加到 商家信息列表 restaurants
			res.data.forEach(item => {
				this.restaurants.push(item);
			});
		} else {
			// 后端没有数据了，停止拉取数据
			this.loading = true;
		}
        });
    }
  }
};
</script>


<style scoped>
.search {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.search_header {
  margin-top: 45px;
  background: #fff;
  padding: 0 4.266667vw;
}
.search_header .search_wrap {
  padding: 2.933333vw 2.933333vw 2.933333vw 0;
  display: flex;
  align-items: center;
  position: relative;
}
.search_wrap .fa-search {
  width: 2.933333vw;
  height: 2.933333vw;
  color: #888;
  position: absolute;
  top: 4.6666666vw;
  left: 2.933333vw;
}
.search_wrap input {
  flex-grow: 1;
  border-radius: 0.266667vw;
  background-color: #f8f8f8;
  padding: 1.733333vw 4vw 1.733333vw 8.8vw;
  color: #666;
  outline: none;
  border: none;
}
.search_wrap button {
  outline: none;
  border: none;
  color: #333;
  font-size: 0.426667rem;
  background: #fff;
  font-weight: 700;
  margin-left: 2.933333vw;
  font-size: 14px;
}

.shop {
  width: 100%;
  height: calc(100% - 95px);
  overflow: auto;
}

.empty_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
}
.empty_wrap img {
  width: 35vw;
  height: 35vw;
}
.empty_txt h4 {
  color: #666;
  font-size: 1rem;
  margin: 12vw 0 2vw 0;
}
.empty_txt span {
  color: #999;
  font-size: 0.8rem;
}
.shoplist {
  height: calc(100% - 41px);
}
</style>
