# 饿了么订餐系统 

#### 项目在线地址：[ele-app](http://154.8.144.57)
> 提示：本项目为移动端项目，建议使用移动设备访问；Pc端请在浏览器控制台中切换到移动端模式进行浏览。


**项目简介** <br>
这是一个使用 Vue全家桶开发的饿了么订餐系统，该项目为移动端项目；<br >
该项目实现的功能有：短信验证码登录、高德定位、商家排序筛选、商家搜索、商品列表详情、购物车添加与清空、订单生成与支付等；<br>
使用Vue全家桶开发，部分页面效果例如轮播、弹框等都使用了Mint-ui移动端组件库，页面滑动效果使用了better-scroll模块，数据请求使用了Axios模块；<br>
本项目实现了订餐类项目的基本业务流程：
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/1.png)

<b>技术栈：Vue全家桶 + Mint-ui + Axios + better-scroll</b> 

## 项目展示
1. 登录页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/2.jpg)
2. 商家页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/3.jpg)
3. 商家商品页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/4.jpg)
4. 商品添加购物车
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/5.jpg)
5. 提交订单页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/6.jpg)
6. 支付页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/7.jpg)
7. 支付完成订单页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/8.jpg)
8. 订单详情页面
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/9.jpg)
9. 商家搜索
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/10.jpg)
10. 用户评价
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/11.jpg)
11. 商家故事
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/12.jpg)
12. 用户登录信息
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/13.jpg)
13. 用户地址
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/15.jpg)
14. 添加地址
![](https://cdn.jsdelivr.net/gh/qiuxchao/CDN/eleProject/14.jpg)


### 项目逻辑

1. 登录组件
> 验证码功能：后端接口会根据提交的手机号返回一个验证码，前端在请求成功后的 .then 中把这个验证码拿到并展示给用户。
2. 高德定位
> 用户登录成功后会直接跳转到主页下，在created钩子函数中调用高德API接口获取用户位置，获取成功后展示在主页顶部并存储到 vuex 中。
3. 商家排序、搜索
> 排序: 给商家排序导航绑定排序规则，当点击某一规则时，发送该规则到后端接口，后端会返回按规则排序的数据；<br>
> 搜索：获取的商家数据会存储在数组中，根据搜索关键词使用filter 和 match 方法遍历商家数据并找出与关键词相匹配的。