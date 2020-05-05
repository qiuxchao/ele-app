<template>
  <!-- 点餐页面，订餐页面的第一个子路由 -->

  <!-- 判断是否有数据，决定是否展示 -->
  <div v-if="shopInfo" class="goods">
    <!-- 头部商家推荐 -->
    <!-- 遍历商家推荐数组（只有一项），得到其中的 name 即商家推荐字符，和商家推荐商品数组 -->
    <div class="recommend" v-for="(recommend, index) in shopInfo.recommend" :key="index">
      <!-- 左上角商家推荐标题 -->
      <p class="recommend-name">{{ recommend.name }}</p>
      <div class="recommend-wrap">
        <ul>
          <!-- 遍历商家推荐商品数组，得到其中的每一个商品数据并展示出来 -->
          <li v-for="(item, index) in recommend.items" :key="index">
            <!-- 商品图片 -->
            <img :src="item.image_path" alt />
            <!-- 商品图片下方商品名字及商品信息 -->
            <div class="recommend-food">
              <!-- 商品名字 -->
              <p class="recommend-food-name">{{ item.name }}</p>
              <!-- 商品月售、好评率 -->
              <p class="recommend-food-zm">月售{{ item.month_sales }} 好评率{{ item.satisfy_rate }}%</p>
            </div>
            <!-- 商品价格 -->
            <div class="recommend-food-price">
              <!-- 价格字符 -->
              <p>¥{{ item.activity.fixed_price }}</p>
              <!-- 价格右边，加减商品数量小球，调用 CartControl 组件 -->
              <!-- 把当前的商品传过去，然后该组件会控制当前商品的数量 -->
              <CartControl :food="item" />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 商品列表（分为左侧商品分类列表，和右侧商品列表） -->
    <div class="menuview">
      <!-- 左侧商品分类列表 -->
      <!-- 添加滚动插件 -->
      <div class="menu-wrapper" ref="menuScroll">
        <ul>
          <!-- 遍历商品分类数组，拿到每一项，包含分类名和商品列表 -->
          <li :class="{ 'current': currentIndex === index }" @click="selectMenu(index)" v-for="(item, index) in shopInfo.menu" :key="index">
            <!-- 判断左边是否右标签（图片） -->
            <img :src="item.icon_url" alt v-if="item.icon_url" />
            <!-- 右侧文字 -->
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>

      <!-- 右侧商品内容列表 -->
      <!-- 添加滚动插件 -->
      <div class="foods-wrapper" ref="foodScroll">
        <ul>
          <li class="food-list-hook" v-for="(item, index) in shopInfo.menu" :key="index">
            <!-- 内容上 （标题和描述）-->
            <div class="category-title">
              <!-- 标题和描述 -->
              <strong>{{ item.name }}</strong>
              <span>{{ item.description }}</span>
            </div>
            <!-- 内容下 （商品列表）-->
            <!-- 遍历商品列表，拿到每一个商品信息并展示出来 -->
            <div @click="handleFood(food)" class="fooddetails" v-for="(food, index) in item.foods" :key="index">
              <!-- 左边商品图片 -->
              <img :src="food.image_path" alt />
              <!-- 右边商品信息 -->
              <section class="fooddetails-info">
                <!-- 商品名 -->
                <h4>{{ food.name }}</h4>
                <!-- 商品描述 -->
                <p class="fooddetails-des">{{ food.description }}</p>
                <!-- 月售，好评率 -->
                <p class="fooddetails-sales">月售{{ food.month_sales }}份 好评率{{ food.satisfy_rate }}%</p>
                <!-- 价格和数量加减小球 -->
                <div class="fooddetails-price">
                  <span class="price">¥{{ food.activity.fixed_price }}</span>
                  <!-- 价格右边，加减商品数量小球，调用 CartControl 组件 -->
                  <!-- 把当前的商品传过去，然后该组件会控制当前商品的数量 -->
                  <CartControl :food="food" />
                </div>
              </section>
            </div>
          </li>
        </ul>
      </div>

    </div>

	<!-- 购物车 -->
	<!-- 调用购物车组件并把数据传过去 -->
	<ShopCart :shopInfo="shopInfo" />

	<!-- 单个商品展示页面 -->
	<!-- 使用 Food 组件并把当前选中的商品信息传过去 -->
	<!-- 把开关传过去，接收点击事件，关闭开关 -->
	<Food :food="selectedFood" :isShow="showFood" @close="showFood = false" />
  </div>
</template>

<script>
// 引入商品数量加减组件
import CartControl from "../../components/Shops/CartControl.vue";
// 引入 better-scroll 滚动插件
import BScroll from "better-scroll";
// 引入购物车组件
import ShopCart from './ShopCart'
// 引入单个商品展示组件
import Food from './Food'
export default {
  name: "Goods",
  data() {
    return {
      // 此处可以使用传值，但是传值会出现数据丢失的情况，因此重新请求
      shopInfo: null, // 页面数据
      menuScroll: {}, // 左侧商品分类列表滚动对象
      foodScroll: {}, // 右侧商品内容列表滚动对象
      scrollY: 0, // 右侧商品列表当前滚动到的 Y 值
	  listHeight: [], // 12 个商品区域的高度
	  selectedFood: null,	// 点击单个商品时，当前商品的信息
	  showFood: false, 	// 单个商品展示页面的开关
    };
  },
  components: {
    // 注册组件
	CartControl,
	ShopCart,
	Food
  },
  created() {
    // 在页面加载后请求订餐信息
    this.getData();
  },
  computed: {
	  // 根据右侧滚动的位置，确定对应的索引下标
	  currentIndex() {
		  for (let i = 0; i < this.listHeight.length; i ++) {
			  let height1 = this.listHeight[i];	// 当前区域的高度
			  let height2 = this.listHeight[i + 1];	// 当前区域的下一个区域的高度

			  // 判断是否在两个区域高度之间
			  if(this.scrollY >= height1 && this.scrollY < height2) {
				  // 在当前区域和下一个区域高度之间，返回当前索引
				  return i;
			  }
		  }
		return 0;
	  }
  },
  methods: {
    getData() {
      // 请求订餐数据
      this.$axios("/api/profile/batch_shop")
        .then(res => {
          // 遍历数据列表，拿到推荐商品列表
          res.data.recommend.forEach(recommend => {
            // 遍历推荐商品列表，拿到每一个推荐商品
            recommend.items.forEach(item => {
              // 给推荐商品设置一个 count 值为 0，以便于增减商品数量
              item.count = 0;
            });
          });

          // 遍历数据列表，拿到商品列表
          res.data.menu.forEach(item => {
            // 遍历商品列表，拿到每一个商品
            item.foods.forEach(food => {
              //   给每一个商品加上一个 count 属性，以便于增减商品数量
              food.count = 0;
            });
          });
          //   console.log(res.data);
          // 存储数据到 data 中
          this.shopInfo = res.data;
          this.$nextTick(() => {
            // DOM 已经更新，初始化滚动插件
            this.initScroll();
            // 计算 12 个商品区域的高度
            this.calculateHeight();
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    initScroll() {
      // 给左侧商品分类列表加载滚动插件
      this.menuScroll = new BScroll(this.$refs.menuScroll, {
        click: true // 滚动区域可被点击
      });
      // 给右侧商品内容列表添加滚动插件
      this.foodScroll = new BScroll(this.$refs.foodScroll, {
        probeType: 3, // 滚动类型
        click: true // 滚动区域可被点击
      });

      // 商品列表滚动的事件，实时获取到滚动的 y 轴的值
      this.foodScroll.on("scroll", pos => {
        // console.log(pos.y);
        // 将右侧的滚动的 y 值四舍五入再取绝对值，然后赋给定义好的 scrollY
        this.scrollY = Math.abs(Math.round(pos.y));
        // 最后得到的是 0 和正整数的 y 轴的值
        // console.log(this.scrollY);
      });
    },
    selectMenu(index) {
      // 左侧分类列表每一项的点击事件，参数为每一项的索引
      // 根据每一项的索引找到商品列表中对应的索引
      // 就可以实现，点击左侧分类，关联到右侧商品列表
      // console.log(index);

      // 使用 refs 获取到商品列表中包裹着商品的每个 li 元素，返回一个数组，数组中的每一项代表一个商品区域
      let foodList = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );

      // 跟据点击商品分类获取到的索引找到商品列表中对应的区域
      let el = foodList[index];
      // console.log(el);

      // 使用 better-scroll 滚动到对应的商品区域
      // scrollToElement()	第一个参数为滚动到的元素，第二个参数为滚动的时间
      this.foodScroll.scrollToElement(el, 250);
    },
    calculateHeight() {
      // 计算右侧商品每个区域的高度
      // 获取到右边所有的商品区域，返回一个数组
      let foodList = this.$refs.foodScroll.getElementsByClassName("food-list-hook");
      // console.log(foodList)
      // 第一个区域的高度为 0，也就是顶部，先添加到数组中
      let height = 0;
      this.listHeight.push(height);
      // 遍历剩下的商品区域数组，拿到每个区域的高度
      // 对区域的高度进行累加，然后 push 到data 中定义好的数组中
      for (let i = 0; i < foodList.length - 1; i++) {
        //  拿到当前的项
        let item = foodList[i];
        // 累加
        height += item.clientHeight;
        // console.log(height);
        // 添加至数组
        this.listHeight.push(height);
      }
    //   console.log(this.listHeight);
	},
	handleFood(food) {
		// 点击某个商品时，获取到当前的商品数据，然后存储到 data 中
		// console.log(food);
		this.selectedFood = food;
		// 打开开关
		this.showFood = true;
	}
  }
};
</script>


<style scoped>
.goods {
  position: relative;
  height: calc(100% - 10.666667vw);
}

.recommend {
  padding-top: 4.266667vw;
  background-color: #fff;
}
.recommend-name {
  padding-left: 4.266667vw;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 2.666667vw;
}
.recommend-wrap {
  overflow-x: scroll;
  display: flex;
  width: 100%;
}
.recommend-wrap ul {
  display: flex;
  padding-left: 4.266667vw;
}
.recommend-wrap ul li {
  flex: none;
  width: 32vw;
  margin-right: 2.666667vw;
}
.recommend-wrap li img {
  display: block;
  width: 32vw;
  height: 32vw;
  border-top-left-radius: 0.8vw;
  border-top-right-radius: 0.8vw;
  max-width: 100%;
}
.recommend-food .recommend-food-name {
  color: #333;
  font-size: 0.8rem;
  margin: 1.866667vw 0 1.233333vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.recommend-food .recommend-food-zm {
  color: #999;
  font-size: 0.6rem;
  margin-bottom: 1.866667vw;
  min-height: 1em;
}
.recommend-food-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.266667vw;
}
.recommend-food-price p {
  font-size: 1rem;
  color: #ff5339;
}

::-webkit-scrollbar {
  width: 0 !important;
}

.menuview {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10.8vw;
  background-color: #fff;
  display: flex;
}
.menu-wrapper {
  overflow-y: hidden;
  /* height: 100%; */
  height: calc(100% - 12.8vw);
  background-color: #f8f8f8;
  padding-bottom: 10.666667vw;
  width: 20.533333vw;
}
.menu-wrapper li {
  padding: 4.666667vw 2vw;
  font-size: 0.6rem;
  color: #666;
  line-height: 1.2;
}
.menu-wrapper li img {
  max-width: 100%;
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: top;
  margin-right: 0.8vw;
}

.foods-wrapper {
  overflow-y: hidden;
  /* height: 100%; */
  height: calc(100% - 12.8vw);
  width: 79.466667vw;
  padding-bottom: 10.666667vw;
}
.category-title {
  margin-left: 2.666667vw;
  padding: 2vw 8vw 2vw 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.category-title strong {
  margin-right: 1.333333vw;
  font-weight: 700;
  font-size: 0.8rem;
  color: #666;
  flex: none;
}
.category-title span {
  flex: 1;
  color: #999;
  font-size: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fooddetails {
  min-height: 30.666667vw;
  padding: 2.666667vw 0 2.666667vw 2.666667vw;
  margin-bottom: 0.133333vw;
  display: flex;
}
.fooddetails img {
  width: 25.333333vw;
  height: 25.333333vw;
  flex: none;
  margin-right: 2.666667vw;
  border-radius: 0.533333vw;
}
.fooddetails-info {
  flex: 1;
  padding-bottom: 6.666667vw;
  padding-right: 4vw;
}
.fooddetails-info h4 {
  padding-right: 4vw;
  font-weight: 700;
  overflow: hidden;
  font-size: 1rem;
  white-space: nowrap;
  width: 40vw;
  text-overflow: ellipsis;
  color: #333;
}
.fooddetails-des {
  margin: 1.333333vw 0;
  font-size: 0.6rem;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 42.666667vw;
}
.fooddetails-sales {
  margin: 1.733333vw 0 !important;
  color: #999;
  font-size: 0.6rem;
  line-height: 1;
  min-height: 1em;
}
.fooddetails-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3.733333vw;
}
.fooddetails-price .price {
  font-size: 1rem;
  line-height: 4.266667vw;
  color: #ff5339;
  padding-bottom: 0.933333vw;
  display: flex;
  align-items: baseline;
}

.menu-wrapper .current {
  background-color: #fff !important;
  color: #333 !important;
}
</style>

