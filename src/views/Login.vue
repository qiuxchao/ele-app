<template>
    <!-- 用户登录页面 -->
    <!-- html 部分 -->
  <div class="login">
     <!-- logo图片 -->
      <div class="logo">
        <img src="../assets/logo.jpg" alt="my login image">
      </div>
     
      <!-- 手机号 -->
      <InputGroup type="number"  v-model="phone" placeholder="手机号" :btnTitle="btnTitle" :disabled="disabled" :error="errors.phone" @btnClick="getVerifyCode"/>
     
      <!-- 验证码 -->
      <InputGroup type="number"  v-model="verifyCode" placeholder="验证码"  :error="errors.code" />
     
     <!-- 用户服务协议 -->
     <div class="login_des">
         <p>
            新用户登录即自动注册，表示已同意
            <span>《用户服务协议》</span>
         </p>
     </div>

     <!-- 登录按钮 -->
    <div class="login_btn">
        <button :disabled="isClick" @click="handleLogin">登录</button>
    </div>

  </div>
</template>

<script>
// js 部分
// 引入登录组件
import InputGroup from '../components/InputGroup'
export default {
    name: "login",
    data() {
        return {
            phone: "",  // 手机号码
            verifyCode: "",  // 验证码
            errors: {   
                //错误信息
            }, 
            btnTitle: "获取验证码",  // 获取验证码按钮
            disabled: false,
        };
    },
    methods: {
        getVerifyCode () {
            // 获取验证码事件
            if(this.validatePhone()) {
                // 手机号有效，发起网络请求短信接口
                this.$axios.post('/api/posts/sms_send', {
                    sid: "42350c14e58902259db2d2fde1cab525",
                    token: "c8c99ea308f6b1034bc95e855861993a",
                    appid: "5ee60ea3d5aa4045a5d41675b219d966",
                    templateid: "538324",
                    phone: this.phone
                }).then(res => {
                    // console.log(res);
                })

                // 请求接口后开启倒计时
                this.validateBtn();
            }
        },
        validatePhone () {
            // 验证手机号码是否有效
            if (!this.phone) {  // 如果手机号码为空
                this.errors = {
                    phone: "手机号码不能为空"
                };
                return false;
            }  else if (!/^1[345678]\d{9}$/.test(this.phone)) {  // 使用正则验证手机号，如果不是匹配的手机
                this.errors = {
                    phone: "请填写正确的手机号码"
                };
                return false;   
            } else {    // 手机号码没有错误，返回 true
                this.errors = {};
                return true;
            }
        },
        validateBtn () {
            // 验证码倒计时
            let time = 60;
            let timer = setInterval(() => {
                if (time == 0) {
                    clearInterval(timer);
                    this.btnTitle = "获取验证码";
                    this.disabled = false;
                } else {
                    // 倒计时
                    this.btnTitle = time + "秒后重试";
                    this.disabled = true;
                    time--;
                }
            }, 1000);
        },
    handleLogin() {
      // 取消错误提醒
      this.errors = {};
      // 发送请求
      this.$axios
        .post("/api/posts/sms_back", {
          phone: this.phone,
          code: this.verifyCode
        })
        .then(res => {
        //   console.log(res);
          // 检验成功 设置登录状态并且跳转到 /,路由根路径
          // localStorage 会可以将第一次请求的数据直接存储到本地，这个相当于一个5M大小的针对于前端页面的数据库
          // 将获取到的用户 id 存储到 localStorage 中，以便于保存当前用户的信息
          localStorage.setItem("ele_login", res.data.user._id);
          this.$router.push("/");
        })
        .catch(err => {
          // 返回错误信息
          this.errors = {
            code: err.response.data.msg
          };
        });
    }
},
    components: {
        // 注册登录组件
        InputGroup
    },
    computed: {
        isClick() {
            // 如果手机号和验证码都为空，desabled 的值为 true ，表示登录按钮不可被点击
            if(!this.phone || !this.verifyCode) return true;
        }
    }
};
</script>

<style scoped>
/* css 部分 */
    .login {
        width: 100%;
        height: 100%;
        padding: 30px;
        box-sizing: border-box;
        background-color: #fff;
    }
    .logo {
        text-align: center;
    }
    .logo img {
        width: 150px;
    }
    .text_group,
    .login_des,
    .login_btn {
    margin-top: 20px;
    }
    .login_des {
    color: #aaa;
    line-height: 22px;
    }
    .login_des span {
    color: #4d90fe;
    }
    .login_btn button {
    width: 100%;
    height: 40px;
    background-color: #48ca38;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    border: none;
    outline: none;
    }
    .login_btn button[disabled] {
    background-color: #8bda81;
    }
    .login_btn button[disabled] {
        background-color: #8bda81;
    }
</style>
