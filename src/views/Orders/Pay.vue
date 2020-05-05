<template>
    <!-- 支付页面 -->
    
    <div class="pay">
        <!-- 调用 Header 组件构建头部，没有返回按钮 -->
        <Header title="在线支付" />

        <!-- 内容区 -->
        <!-- v-if 判断是否拿到了订单数据 -->
        <div class="main" v-if="orderInfo">
            <!-- 支付倒计时 -->
            <div class="tip">
                <p class="countdown-title">支付剩余时间</p>
                <h3 class="countdown-text">{{ countDown }}</h3>
            </div>

            <!-- 订单总价和支付方式 -->
            <section class="home">
                <!-- 商家名和总价 -->
                <ul class="list info-list">
                    <li>
                        <!-- 左侧商家名 -->
                        <span class="order-name">{{ orderInfo.shopInfo.name }}</span>
                        <!-- 右侧订单总价 -->
                        <span class="text-highlight">¥{{ totalPrice }}</span>
                    </li>
                </ul>
                <!-- 在线支付文本 -->
                <div class="title">在线支付</div>
                <!-- 微信支付 -->
                <ul class="list payment-list">
                    <li class="payment-list-item">
                        <div class="icon">
                            <!-- 左侧图片和微信 -->
                            <img src="../../assets/wechart.jpg" alt>
                            <span>微信</span>
                        </div>
                        <!-- 右侧对号图标 -->
                        <i class="fa fa-check-circle selected"></i>
                    </li>
                </ul>
            </section>

            <!-- 确认支付按钮 -->
            <button @click="pay" class="btn-submit" :disabled="timeOut">确认支付</button>
        </div>

    </div>

</template>

<script>
// 引入 Header 组件构建头部
import Header from '../../components/Header'
export default {
    name: 'Pay',
    data() {
        return {
            countDown: "00:15:00",    // 倒计时
            timer: null,     // 定时器
            timeOut: false  // 支付按钮开关，超时后关闭
        }
    },
    beforeRouteEnter(to, from, next) {
        // 一进入该页面就开始倒计时
        next(vm => {
			vm.countTimeDown();
			// 试运行支付成功后的逻辑
			vm.addOrder();
        })
    },
    computed: {
         orderInfo() {
            // 从 vuex 中拿到订单数据
            return this.$store.getters.orderInfo;
        },
        totalPrice() {
            // 从 vuex 中拿到订单总价
            return this.$store.getters.totalPrice;
		},
		userInfo() {
			// 从 vuex 中拿到用户地址信息
			return this.$store.getters.userInfo;
		},
		remarkInfo() {
			// 从 vuex 中拿到订单备注信息
			return this.$store.getters.remarkInfo;
		}
    },
    methods: {
        countTimeDown() {
            // 倒计时
            // 定义初始分钟数
            let minute = 14;
            // 定义初始秒数
            let second = 60;
            
            // 开启定时器
            this.timer = setInterval(() => {
                second--;

                if(second == "00" && minute == "00") {
                    // 倒计时结束
                    this.countDown = "订单已超时";
                    // 清除定时器
                    clearInterval(this.timer);
                    // 禁用支付按钮
                    this.timeOut = true;
                    return;
                }
                
                if (second == "00" ) {
                    // 秒 等于00时恢复到59
                    second = 59;
                    // 分钟减一
                    minute --;
                    if(minute < 10) {
                    // 当分数小于 10 时，在前面加上一个字符串 0，确保它是两位数的
                        minute = "0" + minute;
                    }
                }

                if (second < 10) {
                    // 当秒数小于 10 时，在前面加上一个字符串 0，确保它是两位数的
                    second = "0" + second;
                }

                // 给 data 中的倒计时属性赋值
                this.countDown = "00:" + minute + ":" + second;
            }, 1000);
        },
        pay() {
            const data = {
                body: 'QiuXc',  // 商户名
                out_trade_no: new Date().getTime().toString(),  // 当前时间
                total_fee: 1    // 价格
            };
            alert('进入到pay方法中');
            // 请求 http://www.thenewstep.cn/wxzf/example/jsapi.php 
            // 这里不能使用 axios 了，因为这个接口和之前的接口不在一个域名下；
            // 当前已经在 main.js 中配置了根地址，要是还使用 axios ，它会自动在前面拼接上根地址
            // 所以这里使用 fetch 请求接口
            fetch('http://www.thenewstep.cn/wxzf/example/jsapi.php', {
                method: "POST",     // 请求方法
                headers: {  // 请求头
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)  //  发送的数据，需要把对象转成 JSON
            })
                .then(res => res.json())    // fetch 返回一个json，需要解析成对象
                .then(data => {
                    // 调用微信的支付方法，把接口返回的数据传过去
                    this.onBridgeReady(data);
                })
                .catch(err => {
                    alert('支付失败');
                })
        },
        onBridgeReady(data){
            WeixinJSBridge.invoke(
                // 这里第二个参数传入接口返回的对象
                'getBrandWCPayRequest', data , (res) => {
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					alert("支付成功");
					
					// 生成订单
					// this.addOrder();

                } 
			}); 
		},
		addOrder() {
			// 生成订单
			let orderlist = {	// 打包从 vuex 中获取到的所有订单信息
				orderInfo: this.orderInfo,
				userInfo: this.userInfo,
				totalPrice: this.totalPrice,
				remarkInfo: this.remarkInfo
			};
			// console.log(orderlist);
			// post 数据到接口
			this.$axios.post(`/api/user/add_order/${localStorage.ele_login}`, orderlist)
				.then(res => {
					// console.log(res.data);
					// 跳转到订单页面
					this.$router.push('/order');
				})
		}
    },
    components: {
        // 注册组件
        Header
    }

}
</script>


<style scoped>
.pay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}

.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.tip {
  display: block;
  text-align: center;
  background-color: #fff;
  color: #333;
  padding: 2rem;
  line-height: 2rem;
}
countdown-title {
  font-size: 0.88rem;
  color: #999;
}
.countdown-text {
  height: 2rem;
  color: #333;
  font-size: 1.8rem;
}
down-text {
  height: 2rem;
  color: #333;
  font-size: 1.8rem;
}
.list {
  border-bottom: 0.5px solid #eee;
  background: #fff;
}
.info-list {
  padding: 0 1.5rem;
}
.info-list li {
  border-top: 0.5px solid #eee;
  display: flex;
  padding: 1.5rem 0;
  font-size: 1rem;
  line-height: 1rem;
  justify-content: space-between;
}
.info-list li .order-name {
  color: #333;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16px;
  max-width: 60%;
}
.text-highlight {
  color: #ff6000;
}
.title {
  background-color: #f5f5f5;
  font-size: 0.88rem;
  padding: 1.2rem 1.2rem 1rem;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.payment-list-item {
  border-bottom: 0.5px solid #eee;
  padding: 0.9rem 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  display: flex;
  align-items: center;
}
.payment-list-item img {
  width: 2.4rem;
  height: 2.4rem;
  margin-right: 20px;
}
.payment-list-item > i {
  font-size: 1.5rem;
  color: #eee;
}
.selected {
  color: #4cd964 !important;
}
.btn-submit-wrap {
  margin: 1rem auto;
  width: 90%;
}
.btn-submit {
  font-size: 1.1rem;
  line-height: 1.5rem;
  background-color: #4cd964;
  width: 100%;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 5px;
  padding: 0.5rem;
  box-sizing: border-box;
}

/* 不可点击btn */
.btn-submit[disabled] {
  background-color: #bbb !important;
}
</style>



