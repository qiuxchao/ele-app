<template>
    <!-- 选择城市页面，点击 Address 页面中的城市名后跳转到该页面 -->
    <!-- html 部分 -->
  <div class="city">

      <!-- 头部搜索 -->
      <div class="search_wrap">
          <!-- 搜索框 -->
          <div class="search">
              <i class="fa fa-search"></i>
              <!-- 搜索框通过 v-model 双向绑定到 city_val -->
              <input type="text" v-model="city_val" placeholder="输入城市名">
          </div>
          <!-- 取消按钮 -->
          <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
      </div>

     <!-- 定位信息展示 -->
     <!-- 这里的 v-if ：如果搜索提示数组为空，则显示定位信息 -->
      <div style="height:100%;" v-if="searchList.length == 0">
          <div class="location">
              <!-- 使用 Location 组件展示当前位置信息为第一行 -->
              <Location :address="city" @click="selectCity({name:city})"/>
          </div>
         <!-- 使用 Alphabet 组件显示右侧字母表 -->
         <Alphabet :cityInfo="cityInfo" :keys="keys" ref="allcity" @selectCity="selectCity" />
      </div>
      
    <!-- 输入框输入内容后，提示信息容器 -->
    <!-- 这里的 v-else : 如果搜索提示数组不为空，也就是上面的 v-if 为假，则显示提示信息 -->
    <div class="search_list" v-else>
      <ul>
        <!-- 添加点击事件，当点击每一个提示信息时，都可以选择该城市并跳转到 address -->
        <li @click="selectCity(item)" v-for="(item, index) in searchList" :key="index">
          {{ item.name }}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
// js 部分
// 引入 Location 展示当前位置信息组件
import Location from '../components/Location'
// 引入 Alphabet 字母表组件
import Alphabet from '../components/Alphabet'
export default {
    name: "City",
    data() {
        return {
            city_val: '',       // 搜索框内输入的信息
            cityInfo: null,   // 需要接收的传来的城市数据
            keys: [],           // 城市字母表
            allCities: [],    // 从 cityInfo 中提取出的所有的城市名
            searchList: []  // 当输入框中输入城市，对应的提示信息
            
        };
    },
    components: {
        // 注册组件
        Location,
        Alphabet
    },
    computed: {
        city() {
            return (this.$store.getters.location.addressComponent.city || this.$store.getters.location.addressComponent.province);
        }
    },
    created() {
      // 在这个页面加载完成前拿到城市数据，调用 getCityInfo 方法
      this.getCityInfo();
    },
    watch: {
      city_val() {
        // 监听搜索框输入的内容，调用 searchCity 方法，弹出对应的城市提示信息
        // console.log(this.city_val);
        this.searchCity();
      }
    },
    methods: {
      getCityInfo() {
        // 请求后端接口，拿到城市列表数据
        this.$axios("/api/posts/cities")
        .then((res) => {
          // 请求成功，返回的信息在 res.data 中
          // console.log(res.data);
          this.cityInfo = res.data;
          // 处理 key 计算 key
          this.keys = Object.keys(res.data);
          // console.log(this.keys);
          // 在 key 列表中移除 热词hotcities 这个 key
          this.keys.pop();
          // keys 排序
          this.keys.sort();
          // console.log(this.keys)

          // 通过 $ref 引用 Alphabet 组件中的方法
          // 使用 if 避免抛出二级调用错误
          if (this.$refs.allcity) {
            this.$nextTick(() => {
              this.$refs.allcity.initScroll();
          });
          }

        // 存储所有城市，用来搜索过滤
        this.keys.forEach(key => {
          // 遍历所有 key ，拿到字母表
          // console.log(key);
          this.cityInfo[key].forEach(city => {
            // 根据字母表遍历城市，拿出每一个城市信息
            // console.log(city);
            this.allCities.push(city);
          })
        }) 

        })
        .catch((err) => {
          console.log(err);
        })
      },
      selectCity(city) {
        // 接收 Alphabet 组件传来的城市信息
        // console.log(city);
        // 将 city.name 中的城市名传给 address 组件，并跳转到该组件
        this.$router.push({name:"address", params: {city: city.name}});
      },
      searchCity() {
        // 根据输入的内容检索对应的城市，并添加到 searchList 数组中
        if(!this.city_val) {
          // 如果搜索框为空，数组置空
          this.searchList = [];
        } else {
          // 根据输入框的关键字检索城市，并存入到 searchList 数组中
          this.searchList = this.allCities.filter(item => {
            return item.name.indexOf(this.city_val) != -1;
          });
        }
        // console.log(this.searchList);
      }
    }
};
</script>

<style scoped>
/* css 部分 */
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
    border: none;
    background: none;
    outline: none;
    color: #009eef;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

</style>
