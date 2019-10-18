<template>
  <div class="pay">
    <Header title="在线支付" />
    <div class="main" v-if="orderInfo">
      <div class="tip">
        <p class="countdown-title">支付剩余时间</p>
        <h3 class="countdown-text">{{countDown}}</h3>
      </div>
      <section class="home">
        <ul class="list info-list">
          <li>
            <span class="order-name">{{orderInfo.shopInfo.name}}</span>
            <span class="text-highlight">¥{{totalPrice}}</span>
          </li>
        </ul>
        <div class="title">在线支付</div>
        <ul class="list payment-list">
          <li class="payment-list-item">
            <div class="icon">
              <img src="../../assets/wechart.jpg" alt />
              <span>微信</span>
            </div>
            <i class="fa fa-check-circle selected"></i>
          </li>
        </ul>
      </section>
      <button @click="pay" :disabled="timeOut" class="btn-submit">确认支付</button>
    </div>
  </div>
</template>

<script>
import Header from "../../components/Header";
import { setInterval, clearInterval } from "timers";
export default {
  name: "Pay",
  data() {
    return {
      countDown: "00:15:00", // 初始化倒计时
      timer: null, // 定义的一个timer 定时器名称
      timeOut: false //  控制 支付按钮的一个标记  （当支付超时时， 将期改为true 禁用按钮）
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 进入页面后就执行倒计时方法
      vm.countTimeDown();
      // vm.addOrder(); // 在进入页面时就调用 测试使用
    });
  },
  computed: {
    // 获取vuex中的  订单信息   价格信息   用户信息  备注信息
    orderInfo() {
      return this.$store.getters.orderInfo;
    },
    totalPrice() {
      return this.$store.getters.totalPrice;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
    remarkInfo() {
      return this.$store.getters.remarkInfo;
    }
  },
  methods: {
    // 支付例计时方法
    countTimeDown() {
      let minute = 14; // 分
      let second = 59; // 秒

      this.timer = setInterval(() => {
        second--;

        if (second == "00" && minute == "00") {
          this.countDown = "订单已超时";
          clearInterval(this.timer);
          this.timeOut = true;
          return;
        }

        if (second == "00") {
          second = 59;
          minute--;

          if (minute < 10) {
            minute = "0" + minute;
          }
        }

        if (second < 10) {
          second = "0" + second;
        }

        this.countDown = "00:" + minute + ":" + second;
      }, 1000);
    },

    // 支付方法
    pay() {
      const data = {
        // 给后台传递的参数
        body: "米修在线", // 商品描述
        out_trade_no: new Date().getTime().toString(),// 商户订单号   值就是随便写的时间戳
        total_fee: 1 // 支付的金额
      };
      alert("进入到pay方法中");
      // 请求 http://www.thenewstep.cn/wxzf/example/jsapi.php
      fetch("http://www.thenewstep.cn/wxzf/example/jsapi.php", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json()) // res.json()    fetch方法需要对获取的数据进行解析
        .then(data => {

          // 成功后  执行微信的方法
          this.onBridgeReady(data);
        })
        .catch(err => {
          alert("请求失败");
        });
    },
    // 此方法是从 微信上拷贝的
    onBridgeReady(data) {
      WeixinJSBridge.invoke("getBrandWCPayRequest", data, res => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。

          // alert("支付成功");

          // 生成订单  （支付成功后调用的方法）
          this.addOrder();
        }
      });
    },
    //  生成订单 
    addOrder() {
      let orderlist = {
        orderInfo: this.orderInfo,
        userInfo: this.userInfo,
        totalPrice: this.totalPrice,
        remarkInfo: this.remarkInfo
      };
      // console.log(orderlist);

      // 将支付后的 所有数据 提交给后台
      this.$axios
        .post(`/api/user/add_order/${localStorage.ele_login}`, orderlist)
        .then(res => {
          // console.log(res.data);
          this.$router.push("/order");
        });
    }
  },
  components: {
    Header
  }
};
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

