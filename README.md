# 饿了么订餐系统 

#### 项目在线地址：[ele-app](http://154.8.144.57)
> 提示：本项目为移动端项目，建议使用移动设备访问；Pc端请在浏览器控制台中切换到移动端模式进行浏览。


**项目简介** <br>
这是一个使用 Vue全家桶开发的饿了么订餐系统，该项目为移动端项目；<br >
该项目实现的功能有：短信验证码登录、高德定位、商家排序筛选、商家搜索、商品列表详情、购物车添加与清空、订单生成与支付等；<br>
使用Vue全家桶开发，部分页面效果例如轮播、弹框等都使用了Mint-ui移动端组件库，页面滑动效果使用了better-scroll模块，数据请求使用了Axios模块；<br>
本项目实现了订餐类项目的基本业务流程：
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/1.png)

<b>技术栈：Vue全家桶 + Mint-ui + Axios + better-scroll</b> 

---
## 项目展示
1. 登录页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/2.jpg" width="200" height="500" />
2. 商家页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/3.jpg" width="200" height="500" />
3. 商家商品页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/4.jpg" width="200" height="500" />
4. 商品添加购物车 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/5.jpg" width="200" height="500" />
5. 提交订单页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/6.jpg" width="200" height="500" />
6. 支付页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/7.jpg" width="200" height="500" />
7. 支付完成订单页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/8.jpg" width="200" height="500" />
8. 订单详情页面 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/9.jpg" width="200" height="500" />
9. 商家搜索 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/10.jpg" width="200" height="500" />
10. 用户评价 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/11.jpg" width="200" height="500" />
11. 商家故事 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/12.jpg" width="200" height="500" />
12. 用户登录信息 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/13.jpg" width="200" height="500" />
13. 用户地址 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/15.jpg" width="200" height="500" />
14. 添加地址 <br>
<img src="https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/14.jpg" width="200" height="500" />

---
### 项目逻辑
由于本项目涉及到的知识点较多，下面只罗列了部分功能的实现逻辑

1. 登录组件
> 验证码功能：后端接口会根据提交的手机号返回一个验证码，前端在请求成功后的 .then 中把这个验证码拿到并展示给用户；<br>
> 使用路由守卫确保在用户没有登录成功的状态下一直停留在登录页面
2. 高德定位
> 用户登录成功后会直接跳转到主页下，在created钩子函数中调用高德API接口获取用户位置，获取成功后展示在主页顶部并存储到 vuex 中。
3. 商家排序、搜索
> 排序: 给商家排序导航绑定排序规则，当点击某一规则时，发送该规则到后端接口，后端会返回按规则排序的数据；<br>
> 搜索：获取的商家数据会存储在数组中，根据搜索关键词使用filter 和 match 方法遍历商家数据并找出与关键词相匹配的。
4. 商品数量加减、购物车
> 小球组件：封装商品小球组件，接收传值为商品初始数量，商品数量为 0 时不显示减号；<br>
> 购物车：商品数量变化时通过计算属性传入购物车组件中，实现数据的响应式，购物车中的数量增减时页面中也会同时发生变化
5. 生成订单
> 用户点击去计算时将购物车中的商品数据存储到 vuex 中再跳转到订单页面，订单页面使用计算属性获取到 vuex 中存储到商品数据、总价然后通过 v-for 遍历出来；<br>
> 验证用户是否选择了地址等其他必须的信息，如表单验证通过，可跳转到订单支付页面。
6. 订单支付
> 在订单支付页面获取 vuex 中存储的所有订单数据，打包后发送到后端接口，然后跳转到已完成订单组件。
