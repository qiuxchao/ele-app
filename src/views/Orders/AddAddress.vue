<template>
  <!-- 添加地址页面 -->
  <div class="addAddress">
    <!-- 使用 Header 组件构建头部 -->
    <Header :isLeft="true" @changeRouter="$router.go(-1)" :title="title" />

    <!-- 添加地址容器 -->
    <div class="viewbody">
      <!-- 表单区 -->
      <div class="content">
        <FormBlock
          v-model="addressInfo.name"
          label="联系人"
          placeholder="姓名"
          :tags="sexes"
          @checkSex="checkSex"
          :sex="addressInfo.sex"
        />
        <FormBlock v-model="addressInfo.phone" label="电话" placeholder="手机号码" />
        <FormBlock
          v-model="addressInfo.address"
          @click="showSearch = true"
          label="地址"
          placeholder="小区/写字楼/学校等"
          icon="angle-right"
        />
        <FormBlock
          v-model="addressInfo.bottom"
          label="门牌号"
          placeholder="10号楼5单元404"
          icon="edit"
          textarea="textarea"
        />
        <!-- 标签组件，把定义好的标签数组传过去，该组件会进行遍历并展示出来 -->
        <div class="formblock">
          <div class="label-wrap">标签</div>
          <!-- 把当前选择的标签传过去，标签组件会进行匹配，从而显示一个选中的样式 -->
          <TabTag :tags="tags" @checkTag="checkTag" :selectTag="addressInfo.tag" />
        </div>
      </div>

      <!-- 确定按钮 -->
      <div class="form-button-wrap">
        <!-- 点击事件，验证表单，提交表单 -->
        <button @click="handleSave" class="form-button">确定</button>
      </div>
    </div>

    <!-- 搜索地址，点击地址时展示 -->
    <!-- close 取消按钮事件，点击时隐藏该组件 -->
    <AddressSarch @close="showSearch=false" :addressInfo="addressInfo" :showSearch="showSearch" />
  </div>
</template>


<script>
// 引入 Header 组件，构建头部
import Header from "../../components/Header";
// 引入添加地址表单组件
import FormBlock from "../../components/Orders/FormBlock";
// 引入标签组件
import TabTag from "../../components/Orders/TabTag";
// AddressSarch 地址搜索组件
import AddressSarch from "../../components/Orders/AddressSearch";
// 引入 Mint-ui ，使用错误提示框
import { Toast } from "mint-ui";
export default {
  name: "AddAddress",
  data() {
    return {
      title: "", // Header 标题
      tags: ["家", "学校", "公司"], // 标签内容
      sexes: ["先生", "女士"], // 表单中的标签
      addressInfo: {
      //   // 表单数据，要 Post 到接口的对象
      //   tag: "", // 选中的地址标签
      //   sex: "", // 选择的性别标签
      //   address: "", // 选择的地址，由搜索地址组件赋值
      //   name: "", // 收货人姓名
      //   phone: "", // 收货人电话
      //   bottom: "" // 门牌号
      },
      showSearch: false // 是否显示地址搜索组件
    };
  },
  components: {
    // 注册组件
    Header,
    FormBlock,
    TabTag,
    AddressSarch
  },
  beforeRouteEnter(to, from, next) {
    // 接收编辑按钮事件传过来的值
    next(vm => {
      // vm 是当前组件的实例，也就是 this
      // to.params.addressInfo 是路由传来的对象
      // 把路由传来的对象赋给本组件的 addressInfo
      vm.addressInfo = to.params.addressInfo;
      vm.title = to.params.title;
    })
  },
  methods: {
    checkTag(item) {
      // 点击标签时把从标签组件中接收到的值赋给 data 中 tag
      // console.log(item);
      this.addressInfo.tag = item;
    },
    checkSex(item) {
      // 点击标签时把从表单组件中接收到的值赋给 data 中 tag
      // console.log(item)
      this.addressInfo.sex = item;
    },
    handleSave() {
		// 确定按钮事件
		//   console.log(this.addressInfo);
		// 判断表单是否填写完整，如果没有，弹出提示信息
		if(!this.addressInfo.name) {
			this.showMsg("请输入联系人");
			return;
		}
		if(!this.addressInfo.phone) {
			this.showMsg("请输入手机号码");
			return;
		}
		if(!this.addressInfo.address) {
			this.showMsg("请输入收货地址");
			return;
		}
		
    // 上面的验证都通过了，存储数据或更改数据
    if (this.title == "添加地址") {
      // 当前在添加地址页面下，添加数据
      this.addAddress();
    } else {
      // 当前在编辑地址页面下，修改数据
      this.editAddress();
    }
    },
    showMsg(msg) {
      // 表单提示信息
      // 调用 Mint-ui 的弹出框，传入提示文本
      Toast({
        message: msg ,	// 提示文本
        position: "bottom",	// 提示框位置
        duration: 2000	// 持续时间
      });
	},
	addAddress() {
		// 将地址数据 post 到接口中，需要从 localStorage 中取出用户 id 拼接到接口地址中
		this.$axios.post(`/api/user/add_address/${localStorage.ele_login}`, this.addressInfo)
			.then(res => {
				// console.log(res.data);
				// 用户地址添加成功，先判断 vuex 中有没有地址数据
        if(!this.$store.getters.userInfo) {
          // vuex 中没有地址数据，将数据添加到 vuex 中
          this.$store.dispatch('setUserInfo', this.addressInfo); 
        }
        // 跳转到我的地址组件
        this.$router.push('/myAddress');
			})
			.catch(err => {
				console.log(err);
			});
  },
  editAddress() {
    // 编辑地址，发送Post请求，接口地址中需要拼接上 用户 id 和当前的地址 id，然后把地址对象post过去
    this.$axios.post(`/api/user/edit_address/${localStorage.ele_login}/${this.addressInfo._id}`,this.addressInfo)
      .then(res => {
        // 修改地址完成，跳转到我的地址组件
        this.$router.push('/myAddress');
      })
  }
  }
};
</script>


<style scoped>
.addAddress {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 45px;
}
.viewbody {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.content {
  padding-left: 4vw;
  background: #fff;
  font-size: 0.94rem;
}

.formblock {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
}
.formblock .label-wrap {
  flex-basis: 17.333333vw;
  padding: 3.733333vw 0;
  line-height: 4.8vw;
  color: #333;
  font-weight: 700;
}

/* 确定按钮 */
.form-button-wrap {
  padding: 5.333333vw 4vw;
  display: flex;
}
.form-button-wrap .form-button {
  background: #00d762;
  text-align: center;
  border-radius: 0.533333vw;
  flex: 1;
  font-size: 1.1rem;
  line-height: 5.066667vw;
  color: #fff;
  padding: 3.333333vw 0;
  border: none;
  font-weight: 500;
}
</style>


