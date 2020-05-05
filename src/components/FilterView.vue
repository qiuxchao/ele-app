<template>
    <!-- 排序导航 -->

    <!-- 组件显示隐藏遮罩 -->
    <!-- 点击事件：当点击自身时，隐藏 -->
    <!-- 当点击综合排序或者筛选时，都展示蒙版菜单 -->
    <div :class="{'open': isSort || isScreen}" @click.self="hideView">
        
    <!-- 使用 v-if 判断 filterData 是否有数据，有数据就展示，没有则不展示 -->
    <div v-if="filterData" class="filter_wrap">

        <!-- 内容布局 -->
        <aside class="filter">
            <!-- 遍历导航内容，绑定class 在当前下标等于data中定义的下标的时候加粗字体-->
            <!-- 添加单击事件，传入索引值，在点击每一项的时候通过事件函数改变data中的下标 -->
            <div class="filter-nav" 
            v-for="(item, index) in filterData.navTab" 
            :key="index" 
            :class="{'filter-bold': currentFilter == index}"
            @click="filterSort(index)">
                <!-- 排序字段 -->
                <span>{{ item.name }}</span>
                <!-- 排序图标，判断是否有图标，有就显示，没有就不显示 -->
                <i v-if="item.icon" :class="'fa fa-' + item.icon"></i>
            </div>
        </aside>
        
    </div>

    <!-- 综合排序下拉菜单 -->
    <!-- v-if 判断是否进入蒙版中，进入则显示下拉菜单，没有进入则不显示 -->
    <section class="filter-extend" v-if="isSort">
        <ul>
            <!-- 遍历数据列表，显示内容到下拉菜单中 -->
            <li v-for="(item, index) in filterData.sortBy" :key="index">
                <!-- 添加选中状态的 class 样式，绑定事件把当前项和索引值传入参数中 -->
                <span :class="{'selectName': currentSort == index}" @click="selectorSort(item, index)">{{ item.name }}</span>
                <i v-show="currentSort == index" class="fa fa-check"></i>
            </li>
        </ul>

    </section>

    <!-- 筛选蒙版菜单 -->
    <!-- v-if 当点击筛选后，显示筛选菜单 -->
        <section class="filter-extend" v-if="isScreen">
            <div class="filter-sort">
                <!-- 遍历 screenBy 筛选菜单数据 -->
                <div v-for="(screen, index) in filterData.screenBy" :key="index" class="morefilter">
                    <!-- 二级菜单标题（商家服务（可多选）、优惠活动（单选）等） -->
                    <p class="title">{{ screen.title }}</p>
                    <!-- 遍历每个标题下面对应的子选项，子选项数据在 screen.data 中 -->
                    <ul>
                        <!-- 添加选中样式 -->
                        <li v-for="(item, i) in screen.data" :key="i"  :class="{'selected': item.select}" @click="selectScreen(item, screen)">
                            <!-- 判断是否有图标图片 -->
                            <img v-if="item.icon" :src="item.icon" alt=""> 
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        <!-- 二级菜单下方 清空 和 确定 按钮 -->
        <div class="morefilter-btn">
            <!-- class 值为 edit ：当任何一个子选项被选中时，edit 为 true ，edit 样式生效  -->
            <!-- clearFilter事件： 当点击清空按钮时，所有的子选项取消选中 -->
            <span :class="{'edit': edit}" @click="clearFilter" class="morefilter-clear">清空</span>


            <span @click="filterOk" class="morefilter-ok">确定</span>
        </div>
    </section>
</div>
</template>


<script>
export default {
    name: "FilterView",
    data() {
        return {
            currentFilter: 0,    // 当前的排序导航栏中的项的下标
            isSort: false,  // 是否显示蒙版
            currentSort: 0,     // 当前选择的综合排序下拉菜单的项的下标
            isScreen: false
        }
    },
    props: {    // 接收传值
        filterData: Object  
    },
    computed: {
        edit() {
            // 判断筛选二级菜单中是否有被选中的项，如果有，清空按钮就可被点击
            let edit = false;
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    if(item.select) {
                        edit = true;
                    }
                })
            })
            return edit;
        }
    },
    methods: {
        filterSort(index)  {
            // 改变 currentFilter 的值为当前索引值
            this.currentFilter = index;

            switch(index) {
                // 点击第0项（综合排序）时添加蒙版，展示下拉菜单
                case 0:
                    this.isSort = true;
                    // 注册事件，点击当前项后让home中的头部搜索框置顶
                    this.$emit("searchFixed", true);
                    break;

                // 点击第 1 项（距离最近）时将排序规则传递给 home
                case 1: 
                    this.$emit("update", {condition: this.filterData.navTab[1].condition});
                    this.hideView();
                    break;

               // 点击第 2 项（品质联盟）时将排序规则传递给 home
               case 2: 
                    this.$emit("update", {condition: this.filterData.navTab[2].condition});
                    this.hideView();
                    break;

               // 点击第 3 项（筛选）时, 展示蒙版，搜索框置顶
               case 3: 
                    this.isScreen = true;
                    this.isSort = false;
                    this.$emit("searchFixed", true);
                    break;

               default: 
                    // 默认隐藏遮罩层，home 中的搜索框取消置顶
                    this.hideView();
                    break;
            }
        },
        hideView() {
            // 隐藏遮罩层，home 中的搜索框取消置顶
            this.isSort = false;
            this.isScreen = false;
            this.$emit("searchFixed", false);
        },
        selectorSort(item, index) {
            // 点击综合排序的下拉菜单的项，改变 data 中的索引值，从而改变当前选择的项的样式
            this.currentSort = index;
            // 将点击的项的名字替换掉 "综合排序"
            this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
            this.hideView();    // 选择排序方式后隐藏遮罩层

            // 注册 更新数据事件
            this.$emit("update", { condition: item.code });
        },
        selectScreen(item, screen) {
            if(screen.id !== "MPI") {   // 如果当前二级菜单 id 不等于 MPI（商家服务），就为单选
                // 遍历出单选菜单下的每一项，把 select（是否选中） 值都设置为 false 
                screen.data.forEach(ele => {
                    ele.select = false;
                })
            }
            // 把当前点击的那一项的 select 设置为 true （选中的）
            item.select = !item.select;
        },
        clearFilter() {
            // 清空按钮事件，将所有的子选项的 select 值变为 false
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach(item => {
                    item.select = false;
                })
            })
        },
        filterOk() {
            // screenData : 选择排序规则后，发送的后端的数据
            let screenData = {
                MPI: "",    // 商家服务
                offer: "",  // 优惠活动
                per: ""     // 人均消费
            }
            // mpiStr 排序规则，每一项用逗号分隔，便于后端处理
            let mpiStr = "";
            this.filterData.screenBy.forEach(screen => {
                screen.data.forEach((item, index) => {
                    // 如果当前有被选中的项
                    if(item.select) {
                        // 两种情况： 1. 多选   2. 单选
                        if(screen.id !== "MPI") {
                            // 单选（此选项无效，因为当前后端只能返回 蜂鸟专送排序）
                            screenData[screen.id] = item.code;
                    } else {
                        // 多选，返回 code（排序规则）
                        mpiStr += item.code + ",";
                        // 将排序规则添加到 screenData 中
                        screenData[screen.id] = mpiStr;
                        }
                    }
                })
            })
            // console.log(mpiStr);
            // 在 home 中更新排序规则
            this.$emit("update", { condition: screenData });

            // 隐藏遮罩层
            this.hideView();
        }
    }
}
</script>


<style scoped>
    .filter_wrap {
        background: #fff;
        position: sticky;
        top: 54px;
        z-index: 10;
    }
    .filter {
        position: relative;
        border-bottom: 1px solid #ddd;
        line-height: 10.4vw;
        z-index: 101;
        height: 10.666667vw;
        display: flex;
        justify-content: space-around;
    }
    .filter-nav {
        flex: 1;
        text-align: center;
        color: #666;
        font-size: 0.8333rem;
    }
    .filter-nav i {
        width: 1.6vw;
        height: 0.8vw;
        margin-left: 1.333333vw;
        margin-bottom: 0.533333vw;
        fill: #333;
        will-change: transform;
    }

    .filter-bold {
        font-weight: 600;
        color: #333;
    }

    .open {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease-in-out;
        z-index: 3;
    }

    .filter-extend {
        background-color: #fff;
        color: #333;
        padding-top: 2.133333vw;
        position: absolute;
        width: 100%;
        z-index: 4;
        left: 0;
        top: 24.533333vw;
    }
    .filter-extend li {
        position: relative;
        padding-left: 5.333333vw;
        line-height: 10.666667vw;
        overflow: hidden;
    }
    .fa-check {
        float: right;
        color: #009eef;
        margin-right: 3.733333vw;
        line-height: 10.666667vw;
    }

    .selectName {
        color: #009eef;
    }
    /* 筛选 */
    .filter-sort {
        background: #fff;
        padding: 0 2.666667vw;
        line-height: normal;
    }
    .morefilter {
        margin: 2.666667vw 0;
        overflow: hidden;
    }
    .morefilter .title {
        margin-bottom: 2vw;
        color: #666;
        font-size: 0.5rem;
    }
    .morefilter ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 0.8rem;
    }
    .morefilter li {
        box-sizing: border-box;
        width: 30%;
        height: 9.333333vw;
        line-height: 9.333333vw;
        margin: 0.8vw 1%;
        background: #fafafa;
    }
    .morefilter li img {
        width: 3.466667vw;
        height: 3.466667vw;
        vertical-align: middle;
        margin-right: 0.8vw;
    }
    .morefilter li span {
        margin-left: 2%;
        vertical-align: middle;
    }

    .morefilter-btn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fafafa;
        box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
        line-height: 11.466667vw;
        box-sizing: border-box;
    }
    .morefilter-btn span {
        font-size: 0.826667rem;
        text-align: center;
        text-decoration: none;
        flex: 1;
    }
    .morefilter-clear {
        color: #ddd;
        background: #fff;
    }
    .morefilter-ok {
        color: #fff;
        background: #00d762;
        border: 0.133333vw solid #00d762;
    }

    .selected {
        color: #3190e8 !important;
        background-color: #edf5ff !important;
    }

    .edit {
        color: #333 !important;
    }
</style>