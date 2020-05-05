<template>
    <!-- 评价组件，订餐页面的第二个子路由 -->
    <!-- v-if 判断是否获取到数据，决定是否展示该组件 -->
    <div class="comment" v-if="evaluation">
        <!-- 头部商家评分和其他评分 -->
        <section class="rating-wrap">
            <!-- 左侧商家评分 -->
            <div class="rating-info">
                <!-- 分数 -->
                <h4>{{ evaluation.rating.shop_score.toFixed(1) }}</h4>
                <!-- 商家评分和星星显示，使用了星星组件 -->
                <div class="shop-score">
                    <span>商家评分</span>
                    <Rating :rating="evaluation.rating.shop_score" />
                </div>
            </div>
            <!-- 其他评分，味道、包装、配送 -->
            <div class="other-score">
                <!-- 味道和包装评分 -->
                <div class="tp-score">
                    <div>
                        <span>味道</span>
                        <p>{{ evaluation.rating.taste_score.toFixed(1) }}</p>
                    </div>
                    <div>
                        <span>包装</span>
                        <p>{{ evaluation.rating.package_score.toFixed(1) }}</p>
                    </div>
                </div>
                <!-- 配送评分 -->
                <div class="rider-score">
                    <span>配送</span>
                    <p>{{ evaluation.rating.rider_score.toFixed(1) }}</p>
                </div>
            </div>
        </section>

        <!-- 顾客评论区 -->
        <div class="shop-info">
            <!-- 顶部标签列表 -->
            <ul class="tags">
                <!-- 遍历标签数据，拿到每一个标签并展示出来 -->
                <!-- 当 li 的差评属性为 true 时，给它加上一个特殊的样式 -->
                <li :class="{'unsatisfied' :item.unsatisfied}"
                 v-for="(item, index) in evaluation.tags" :key="index">
                    {{ item.name }}
                    <!-- 标签的数量，大于 0 时才显示 -->
                    <span v-if="item.count > 0">{{ item.count }}</span>
                </li>
            </ul>
            <!-- 顾客评价内容列表 -->
            <ul class="comments-wrap">
                <!-- 遍历顾客评价列表，拿到每一条顾客评价 -->
                <li v-for="(item, index) in evaluation.comments" :key="index">
                    <!-- 左侧用户头像，有头像的用户显示头像，没有头像的用户显示默认头像 -->
                    <div class="comment-user">
                        <img :src="item.avatar || 'https://shadow.elemecdn.com/faas/h5/static/sprite.3ffb5d8.png'" alt="">
                    </div>
                    <!-- 右侧评论信息 -->
                    <div class="comments-info">
                        <div class="comment-name">
                            <!-- 用户名 -->
                            <h4>{{ item.username }}</h4>
                            <!-- 时间 -->
                            <small>{{ item.rated_at }}</small>
                        </div>
                        <!-- 星级评分和超赞等标签 -->
                        <div class="comment-rating">
                            <!-- 调用星星组件，展示星星样式 -->
                            <Rating :rating="item.rating" />
                            <!-- 超赞、吐槽等标签，调用 ratingContent 函数，并把获取到的标签内容和颜色展示出来 -->
                            <span :style="{'color': ratingContent(item.rating).color}">{{ ratingContent(item.rating).txt }}</span>
                        </div>
                        <!-- 评价文本 -->
                        <div class="comment-text">{{ item.rating_text }}</div>
                        <!-- 回复文本 -->
                        <div class="comment-reply">{{ item.reply.content }}</div>
                        <!-- 评价图片列表 -->
                        <ul class="comment-imgs">
                            <!-- 遍历图片列表 -->
                            <li v-for="(img, i) in item.order_images" :key="i">
                                <img :src="img.image_hash" alt="">
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>



<script>
// 引入星星评分组件
import Rating from '../../components/Rating'
export default {
    name: "Comments",
    data() {
        return {
            evaluation: null    // 评价数据
        }
    },
    components: {
        // 注册组件
        Rating
    },
    created() {
        // 页面渲染前请求数据
        this.getData();
    },
    methods: {
        getData() {
            // 请求接口，拿到评价数据
            this.$axios("/api/profile/comments")
                .then(res => {
                    // console.log(res.data);
                    this.evaluation = res.data;
            });  
        },
        ratingContent(rating) {
            // 根据传入的评分，返回对应的标签
            const content = [
                {txt: "吐槽", color: "rgb(137, 159, 188)"},  // 1分
                {txt: "较差", color: "rgb(137, 159, 188)"},  // 2 分
                {txt: "一般", color: "rgb(251, 154, 11)"},     // 3 分
                {txt: "满意", color: "rgb(251, 154, 11)"},     // 4 分
                {txt: "超赞", color: "rgb(255, 96, 0)"}       // 5 分
            ];
            // 返回评分减一的下标，例如：
            // 5 分 - 1 = 4，下标为4 的是超赞
            return content[rating-1];
        }
    }
}
</script>


<style scoped>
.comment {
  height: calc(100% - 10.666667vw);
  line-height: 1.2;
}
.rating-wrap {
  display: flex;
  margin-bottom: 2.133333vw;
  padding: 5.333333vw 0 8vw 6.4vw;
  background-color: #fff;
}
.rating-info {
  display: flex;
  justify-content: space-between;
  width: 33.6vw;
  align-items: center;
  color: #666;
}
.rating-info h4 {
  align-items: center;
  font-size: 2.2rem;
  color: #ff6000;
}
.rating-info .shop-score {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.other-score {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}
.tp-score {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  padding: 0 7.2vw;
  align-items: center;
}
.tp-score > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tp-score > div > span,
.rider-score > span {
  font-size: 0.8rem;
  margin-bottom: 1.333333vw;
}
.tp-score > div > p,
.rider-score > p {
  font-size: 1rem;
}
.rider-score {
  width: 22.933333vw;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.shop-info {
  background-color: #fff;
  padding: 2.666667vw 3.2vw 0;
  font-size: 0.8rem;
}
.tags {
  padding-bottom: 2.666667vw;
  border-bottom: 1px solid #eee;
}
.tags li {
  color: #6d7885;
  background-color: #ebf5ff;
  display: inline-block;
  padding: 0 2.4vw;
  height: 7.466667vw;
  line-height: 7.466667vw;
  margin: 0.933333vw;
  font-size: 0.7rem;
  border-radius: 0.533333vw;
}

.unsatisfied {
  color: #aaa !important;
  background-color: #f5f5f5 !important;
}

.comments-wrap > li {
  padding: 4vw 0 3.2vw;
  border-bottom: 0.133333vw solid #eee;
  display: flex;
}
.comment-user {
  width: 10.666667vw;
}
.comment-user img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.comments-info {
  flex: 1;
  font-size: 0.9rem;
}
.comment-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.comment-name h4 {
  margin-top: 0;
  color: #333;
  margin-right: 1.6vw;
}
.comment-name small {
  font-size: 0.6rem;
  color: #999;
}
.comment-rating {
  display: flex;
  margin: 1.6vw 0 0.533333vw;
  align-items: center;
}
.comment-rating > span {
  font-size: 0.6rem;
  margin-left: 1.066667vw;
}
.comment-text {
  color: #333;
  word-break: break-word;
  margin: 2.133333vw 0;
}
.comment-reply {
  margin: 2.666667vw 0;
  padding: 2.666667vw;
  border-radius: 1.066667vw;
  background: #f3f3f3;
  position: relative;
  font-size: 0.8rem;
}
.comment-reply::after {
  content: " ";
  position: absolute;
  bottom: 100%;
  left: 4vw;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 2.133333vw 2.133333vw;
  border-color: transparent transparent #f3f3f3;
}
.comment-imgs {
  margin-top: 1.066667vw;
  margin-bottom: 3.2vw;
}
.comment-imgs > li {
  display: inline-block;
  margin: 0 0.533333vw;
}
.comment-imgs > li img {
  width: 40vw;
  height: 40vw;
}

</style>

