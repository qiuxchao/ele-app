<template>
  <!-- home 组件页面 -->
  <!-- html 部分 -->
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <!-- 定位信息展示 -->
      <!-- $router.push('/address') 表示当事件发生时，跳转到指定的页面 , params 表示传递数据到跳转的页面中 -->
      <div class="address_map" @click="$router.push({name: 'address', params: {city: city}})">
        <!-- 位置图标 -->
        <i class="fa fa-map-marker"></i>
        <!-- 定位信息 -->
        <span>{{ address }}</span>
        <!-- 下箭头图标 -->
        <i class="fa fa-sort-desc"></i>
      </div>
    </div>

    <!-- 头部搜索 -->
    <!-- fixedview: 当点击商家排序时搜索框置顶 -->
    <div class="search_wrap" :class="{'fixedview': showFilter}" @click="$router.push('/search')">
      <!-- 搜索框 -->
      <div class="shop_search">
        <i class="fa fa-search">搜索商家 商家名称</i>
      </div>
    </div>

    <!-- 内容区 -->
    <div id="container">
      <!-- mint-ui 轮播图 -->
      <!-- 图片轮播 -->
      <mt-swipe :auto="4000" class="swiper">
        <!-- 遍历请求到的图片数组，拿到每一张图片放到 img 标签中 -->
        <mt-swipe-item v-for="(img, index) in swipeImgs" :key="index">
          <img :src="img" alt />
        </mt-swipe-item>
      </mt-swipe>

      <!-- 分类轮播，取消自动播放，变成手动 -->
      <mt-swipe :auto="0" class="entries">
        <mt-swipe-item v-for="(entry, i) in entries" :key="i" class="entry_wrap">
          <div class="foodentry" v-for="(item, index) in entry" :key="index">
            <div class="img_wrap">
              <img :src="item.image" alt />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <!-- 推荐商家字样 -->
    <div class="shoplist-title">推荐商家</div>

    <!-- 商家排序导航，使用 FilterView 组件并把获取到的数据传递过去 -->
    <!-- 接受FilterView 中注册的搜索框置顶事件 -->
    <FilterView :filterData="filterData" @searchFixed="showFilterView" @update="update" />

    <!-- 商家信息展示-->
    <!-- 使用 mint-ui 的上拉刷新，下拉加载功能 -->
    <mt-loadmore
      :top-method="loadData"
      :bottom-method="loadMore"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false"
      :bottomPullText="bottomPullText"
      ref="loadmore"
    >
      <div class="shoplist">
        <!-- 使用 IndexShop 组件，然后遍历商家列表，把每一条商家数据传递过去  -->
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
// js 部分
// 引入 mint-ui 的轮播图、下拉刷新、上拉加载功能
import { Swipe, SwipeItem, Loadmore } from "mint-ui";

// 引入 FilterView 商家排序展示 组件
import FilterView from "../components/FilterView";

// 引入商家信息展示组件
import IndexShop from "../components/IndexShop";
export default {
  name: "home",
  data() {
    return {
      swipeImgs: [], // 存储请求到的轮播图图片
      entries: [], // 存储请求到的条目分类数据（轮播图下面的部分）
      filterData: null, // 商家排序等各种排序数据
      showFilter: false, // 是否将搜索框置顶
      page: 1, // 请求商家数据的页数
      size: 5, // 请求商家的数据条数
      restaurants: [], // 用于存放所有商家信息
      allLoaded: false, // 商家信息是否全部加载完了
      bottomPullText: "上拉加载更多", // 下拉到底部时显示的提示信息
      data: null // 排序组件传来的排序规则
    };
  },
  components: {
    // 注册组件
    FilterView,
    IndexShop
  },
  computed: {
    // 拿到 vuex store 中的位置信息
    address() {
      return this.$store.getters.address;
    },
    // 拿到 vuex store 中的城市或省份信息
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    // 在页面加载后调用 getData() 方法请求页面数据
    this.getData();
  },
  methods: {
    getData() {
      // 请求页面数据
      // 请求轮播图图片和条目数据存储到 data 中
      this.$axios("/api/profile/shopping").then(res => {
        // console.log(res.data);
        this.swipeImgs = res.data.swipeImgs;
        this.entries = res.data.entries;
      });

      // 请求商家排序等各种排序数据存储到 data 中
      this.$axios("/api/profile/filter").then(res => {
        // console.log(res.data);
        this.filterData = res.data;
      });

      // 请求商家数据，调用上拉刷新方法
      this.loadData();
    },
    showFilterView(isShow) {
      // 接收到从 FilterView 组件中传来的布尔值，赋给 data 中的 showFilter
      this.showFilter = isShow;
    },
    update(condition) {
      // 接受到从 FilterView 中传来的更新数据的类型，以展示不同的排序规则
      // console.log(condation); // {condation: "rating"}
      // 将接收到排序规则赋给 data 中的 data
      this.data = condition;
      // 加载数据
      this.loadData();
    },
    loadData() {
      // 下拉刷新
      this.page = 1;
      this.allLoaded = false;
      this.bottomPullText = "上拉加载更多";

      // 请求商家数据
      // 在 url 中使用属性 page 和 size 来获取商家信息的页数和数据条数
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data)
        .then(res => {
          // console.log(res.data);
          // 请求完数据重新渲染
          this.$refs.loadmore.onTopLoaded();
          // 将获取到的商家信息赋给 data 中的 restaurants
          this.restaurants = res.data;
        });
    },
    loadMore() {
      // 上拉加载
      if (!this.allLoaded) {
        this.page++;
        // 请求商家数据
        // 在 url 中使用属性 page 和 size 来获取商家信息的页数和数据条数
        this.$axios
          .post(`/api/profile/restaurants/${this.page}/${this.size}`)
          .then(res => {
            // 请求完数据重新渲染
            this.$refs.loadmore.onBottomLoaded();
            if (res.data.length > 0) {
              // 如果还有数据，遍历数据数组，将每一项加到已有数据数组中
              res.data.forEach(item => {
                this.restaurants.push(item);
              });
              if (res.data < this.size) {
                // 如果剩下的数据小于每次请求数据的条数
                this.allLoaded = true; // 数据全部加载完了
                this.bottomPullText = "没有更多了哦"; // 改变底部提示信息
              }
            } else {
              // 数据数组长度小于等于0，表示没有数据了
              this.allLoaded = true; // 数据全部加载完了
              this.bottomPullText = "没有更多了哦"; // 改变底部提示信息
            }
          });
      }
    }
  }
};
</script>

<style scoped>
/* css 部分 */
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}
.header .address_map {
  color: #fff;
  font-weight: bold;
}
.address_map i {
  margin: 0 3px;
  font-size: 18px;
}
.address_map span {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}
.search_wrap {
  position: sticky;
  top: 0px;
  z-index: 999;
  box-sizing: border-box;
}

/* 轮播图样式 */
.swiper {
  height: 100px;
}
.swiper img {
  width: 100%;
  height: 100px;
}

/* 美食分类样式 */
.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}

/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title::after,
.shoplist-title::before {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title::before {
  margin-right: 3.466667vw;
}
.shoplist-title::after {
  margin-left: 3.466667vw;
}

/*  搜索框置顶 */
.fixedview {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
}

mt-loadmore {
  height: calc(100% - 95px);
  overflow: auto;
}
</style>
