<template>
    <!-- 增加和减少商品小球组件 -->

    <div class="cartcontrol">
        <!-- 左边减号，仅在商品数量大于 0 时出现 -->
        <span class="cartbutton button-minus" @click.stop="decreaseCount" v-if="food.count > 0">
            <!-- 减号图标 -->
            <i class="fa fa-minus"></i>
        </span>
        <!-- 中间商品数量，仅当商品大于 0 时显示 -->
        <span class="cartcount" v-if="food.count > 0">{{ food.count }}</span>
        <!-- 右边加号 -->
        <span class="cartbutton" @click.stop="increaseCount">
            <!-- 加号图标 -->
            <i class="fa fa-plus-circle"></i>
        </span>
    </div>

</template>


<script>
export default {
    name: "CartControl",
    props: {
        food: Object
    },
    methods: {
        decreaseCount() {
            // 减号事件函数
            this.food.count --;
        },
        increaseCount() {
            // 加号事件函数
            this.food.count ++;
        }
    }
}
</script>


<style scoped>
.cartcontrol {
  display: inline-flex;
  align-items: center;
}
.cartbutton {
  display: inline-block;
  vertical-align: middle;
}
.cartbutton i {
  color: rgb(35, 149, 255);
  vertical-align: middle;
  font-size: 1.5rem;
}
.button-minus {
  width: 4.866667vw;
  height: 4.866667vw;
  border: 1px solid rgb(35, 149, 255);
  border-radius: 50%;
  text-align: center;
}
.button-minus i {
  font-size: 1rem;
}
.cartcount {
  display: inline-block;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  vertical-align: middle;
  font-size: 0.8rem;
  width: 6.933333vw;
  overflow: hidden;
}
</style>