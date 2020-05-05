<template>
    <!-- 城市字母表组件 -->
    <!-- html 部分 -->
    <!-- 因为下面的 cityInfo.hotCities 产生了二级的属性访问，如果不加上 v-if 判断，控制台会一直报错 -->
    <!-- 注册了 ref 引用，以便于在 City 组件中引用此组件中的方法 -->
  <div class="area" v-if="cityInfo" ref="area_scroll">
      <div class="scroll_wrap">
          <!-- 热门城市 -->
        <!-- 这里添加了 class 为 cityList 是为了通过 getElementsByClassName 把热门城市和所有城市放到一个数组中 -->
          <div class="hot_wrap cityList">
              <div class="title">热门城市</div>
              <ul class="hot_city">
                  <!-- 给热门城市中每一个 li 注册点击事件，并把城市信息传入参数中  -->
                  <li @click="$emit('selectCity', item)" v-for="(item, index) in cityInfo.hotCities" :key="index">{{ item.name }}</li>
              </ul>
          </div>

          <!-- 所有城市 -->
          <div class="city_wrap citylist">
              <!-- 循环按字母排序的 key -->
              <!-- 这里添加了 class 为 cityList 是为了通过 getElementsByClassName 把热门城市和所有城市放到一个数组中 -->
              <div class="city_content cityList" v-for="(item, index) in keys" :key="index">
                  <div class="title">{{ item }}</div>
                  <!-- 根据字母 key 展示城市名 -->
                  <ul>
                      <!-- 根据 keys 中遍历出的 item 去找 cityInfo 中的每一个 item 项并遍历每一项，这样 cityInfo 中的城市列表就会对应上 keys 中的字母 -->
                       <!-- 给所有城市中每一个 li 注册点击事件，并把城市信息传入参数中 -->
                      <li @click="$emit('selectCity', city)" v-for="(city, index) in cityInfo[item]" :key="index">
                          {{ city.name }}
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      
      <!-- 右侧字母表 -->
      <div class="area_keys">
          <ul>
              <!-- 把整个字母表和井号都看作数组的下标，# 为下标 0 -->
              <li @click="selectKey(0)">#</li>
              <!-- 遍历 keys ，拿出每一项字母放到 li 中 -->
              <!-- 因为前面的井号为下标 0 ，所以每一个 item 都要下标加 1 -->
              <li @click="selectKey(index + 1)" v-for="(item, index) in keys" :key="index">{{ item }}</li>
          </ul>
      </div>

  </div>
</template>

<script>
// js 部分
// 引入滚动组件 better-scroll
import BScroll from 'better-scroll'
export default {
    name: "Alphabet",
    data() {
        return {
            scroll: null
        }
    },
    props: {    // 接收城市对象和key数组
        cityInfo: Object,
        keys: Array
    },
    methods: {
        initScroll() {
            // 滚动方法
            this.scroll = new BScroll(this.$refs.area_scroll, {
                click: true
            })
        },
        selectKey(index) {
            // 参数为右侧 # 加字母表的下标，一共有 23 个
            // console.log(index);
            // console.log(this.$refs.area_scroll.getElementsByClassName("cityList"));
            // 找出所有 class 包含 cityList 的元素，也就是找到 热门城市和所有城市，一共 23 项，对应了 23 个下标
            const cityList = this.$refs.area_scroll.getElementsByClassName("cityList");
            // 根据下标，滚动到对应的元素上
            let el = cityList[index];
            // 滚动到对应的位置上
            this.scroll.scrollToElement(el, 250);
        }
    }
};
</script>

<style scoped>
/* css 部分 */
    .area {
        margin-top: 10px;
        box-sizing: border-box;
        padding: 0 16px;
        background: #fff;
        height: calc(100% - 65px);
        overflow: hidden;
    }
    .scroll_wrap {
        background: #fff;
        overflow: auto;
    }
    .title {
        color: #aaa;
        padding: 15px 0;
    }
    .hot_city {
        padding: 0 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .hot_city li {
        width: 30%;
        background: #f1f1f1;
        margin: 0 10px 10px 0;
        text-align: center;
        padding: 10px;
        box-sizing: border-box;
    }
    .city_content li {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    .area_keys {
        position: fixed;
        right: 0;
        top: 25%;
        color: #aaa;
        font-size: 12px;
        line-height: 1.4;
        text-align: center;
        padding: 0 5px;
    }

</style>
