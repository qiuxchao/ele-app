<template>
    <!-- 商家优惠信息组件 -->
    <div class="rst-activity">
        <!-- 左侧图标和文字 -->
        <div class="activity-txt">
            <!-- 满减图标 -->
            <span :style="{background: '#' + activities[0].icon_color}">{{ activities[0].icon_name }}</span>
            <!-- 满减文本 -->
            <span>{{ activities[0].description }}</span>
        </div>
        <!-- 右侧几个优惠和下箭头 -->
        <!-- @click 点击右侧箭头和文字时，底部弹窗显示 -->
        <div class="activity-count" @click="showSheet = true">
            <span>{{ activities.length }}个优惠</span>
            <i class="fa fa-caret-down"></i>
        </div>

        <!-- 点击优惠后 底部优惠活动弹窗 -->
        <transition name="fade">
            <!-- v-show 底部弹窗默认隐藏，点击优惠时显示 -->
            <div class="act-model" v-show="showSheet">
                <div class="activity-sheet">
                    <!-- 右上角 x 号，单击后关闭弹窗 -->
                    <i class="fa fa-remove" @click="showSheet = false"></i>
                    <h2>优惠活动</h2>
                    <ul>
                        <!-- 遍历优惠活动中的每一项，拿到图标颜色和文本信息 -->
                        <li v-for="(item,index) in activities" :key="index">
                            <!-- 左侧图标 -->
                            <span :style="{background: '#' + item.icon_color}">{{ item.icon_name }}</span>
                            <!-- 右侧文字 -->
                            <span>{{ item.description }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "Activity",
    props: {
        activities: Array   // 接收订餐页面传来的商家优惠信息数据
    },
    data() {
        return {
            showSheet: false    // 底部优惠活动弹窗的开关
        }
    }
}
</script>


<style scoped>
.rst-activity {
  display: flex;
  color: #333;
  margin: 3.2vw auto 0;
  align-items: center;
  font-size: 0.6rem;
  width: 80vw;
}
.rst-activity .activity-txt {
  flex: 1;
  overflow: hidden;
}
.activity-txt span:first-child {
  color: #fff;
  height: 4.466667vw;
  line-height: 3.466667vw;
  font-size: 0.6rem;
  padding: 0.533333vw 1.2vw;
  margin-right: 1.6vw;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 0.266667vw;
}
.activity-count {
  width: 16.266667vw;
  flex-shrink: 0;
  padding-right: 2.933333vw;
  text-align: right;
  color: #999;
}
.activity-count span {
  margin-right: 1vw;
}
.act-model {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.activity-sheet {
  position: absolute;
  background-color: #f5f5f5;
  box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.4);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 5.333333vw 6.933333vw;
  box-sizing: border-box;
}
.activity-sheet h2 {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4.133333vw;
}
.activity-sheet ul {
  height: 50.8vw;
  overflow-y: scroll;
}
.activity-sheet ul li {
  margin-bottom: 3.066667vw;
  display: flex;
  font-size: 0.82rem;
  align-items: center;
}
.activity-sheet ul li span:first-child {
  height: 4.266667vw;
  padding: 0.533333vw 1.6vw;
  margin-right: 1.6vw;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 0.266667vw;
  color: #fff;
  white-space: nowrap;
}
.activity-sheet ul li span:last-child {
  line-height: 1.38;
  flex: 1;
}
.act-model .fa-remove {
  position: absolute;
  font-size: 1.4rem;
  right: 2.666667vw;
  top: 2.666667vw;
  z-index: 1002;
  color: #888;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>









