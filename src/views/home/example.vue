<template>
  <div class="example-wrapper">
    <!-- 头部 -->
    <myMenu :active-index="3" />
    <!-- 搜索 -->
    <div class="sssBox">
      <el-row>
        <el-col :span="24">
          <div class="secBox">
            <div class="sec">
              <input id="secInput" v-model="secInput" type="text" name />
              <button id="secBtn" @click="secBtn">搜索</button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 内容 -->
    <div v-if="!isDetail" class="contBox">
      <div class="yetou">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="isDetail = false">首页</el-breadcrumb-item>
          <el-breadcrumb-item>指导</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-loading="loading">
        <div v-for="(item, index) in judgements" :key="index" class="cont">
          <p class="title" @click="egDetailGet(item.judgement.id)">{{ item.judgement.title }}</p>
          <p class="dec">
            类型&nbsp;
            <span class="color">{{ item.judgement.litigationType }}</span>
            <span>&nbsp;|&nbsp;</span>
            日期&nbsp;{{ item.judgement.judgeDate }}
            <span>&nbsp;|&nbsp;</span>
            来源&nbsp;
            <span class="color">{{ item.judgement.court }}</span>
          </p>
          <div class="line" />
          <p class="case-no">{{ item.judgement.caseNo }}</p>
        </div>
      </div>
    </div>
    <!-- 详情盒子 -->
    <div v-if="isDetail" class="detailBox">
      <div class="yetou">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click.native="closeDetail">首页</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="detailCont">
        <div class="detailHead">
          <p style="font-size:30px">111111111111</p>
          <p style="font-size:16px">222222222222</p>
        </div>
        <div class="detailCenter">3333333333</div>
      </div>
    </div>
  </div>
</template>

<script>
import myMenu from "./components/menu";
import { example, exampleSec, egDetail } from "@/api/example/example.js";
export default {
  name: "Example",
  components: {
    myMenu,
  },
  data() {
    return {
      // 导航
      activeIndex: "4",
      activeIndex2: "1",
      count: 0, // 滚动
      judgements: [], // 数据
      secInput: "", // 搜索值
      egId: "", // 案例id
      judgeCont: "",
      isDetail: false, // 案例内容
      loading: false,
    };
  },
  created() {
    this.fiveData();
  },
  methods: {
    // 头部导航
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 无限滚动加载数据
    load() {
      this.count += 1;
    },
    // 初始5条数据
    fiveData(id) {
      const params = {
        keyword: "合同",
      };
      example(params).then((res) => {
        this.judgements = res.data.judgements;
        console.log(res);
      });
    },
    // 搜索
    secBtn() {
      const params = {
        keyword: this.secInput,
      };
      this.loading = true;
      example(params).then((res) => {
        this.loading = false;
        this.judgements = res.data.judgements;
        console.log(res);
      });
    },
    // 案例详情
    egDetailGet(id) {
      const params = {
        id: id,
      };
      egDetail(params).then((res) => {
        this.judgeCont = res.data.judgement;
        console.log(res.data.judgement);
        this.isDetail = true;
      });
    },
    closeDetail() {
      this.isDetail = false;
    },
  },
};
</script>

<style lang="scss" scope>
.example-wrapper {
  height: 100%;
  .contBox {
    margin-top: 0px;
  }
}
/* 头部 */
.el-carousel__container {
  height: 420px;
}
.wrapper {
  position: relative;
}
.wrapper .floatFront {
  position: absolute;
  background-color: #fff;
  bottom: -103px;
  z-index: 1000;
  left: 13%;
  right: 13%;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.suitTitle {
  font-size: 16px;
  line-height: 60px;
  text-align: center;
  display: flex;
  align-items: center;
}
.suitTitle img {
  width: 30px;
  height: 30px;
}
.logRegBtn {
  margin: 15px 0 auto;
}
/* 搜索 */
.secBox {
  margin: 0 auto;
  height: 80px;
  background: #1b85cf;
}
.sec {
  width: 800px;
  height: 80px;
  margin: 0 auto;
}
#secInput {
  width: 600px;
  height: 35px;
  margin-top: 20px;
  float: left;
  outline: none;
  border: 0;
  border-radius: 6px 0 0 6px;
}
#secBtn {
  width: 80px;
  height: 35px;
  margin-top: 20px;
  float: left;
  margin-left: 0;
  outline: none;
  background: #98c2e8;
  color: #fff;
  border: 0;
  border-radius: 0px 6px 6px 0px;
}
/* 内容 */
.contBox {
  background: #f3f5fa;
  cursor: pointer;
}
.yetou {
  width: 1000px;
  height: 20px;
  padding: 5px;
  background: #f3f5fa;
  margin: 10px auto;
}
.cont {
  width: 1000px;
  padding: 5px;
  background: #fff;
  margin: 2px auto;
  border-radius: 5px;
  padding: 30px 60px;
  cursor: pointer;
  .title {
    color: #212121;
    font-size: 26px;
    margin-bottom: 20px;
  }
  .dec {
    color: #9d9d9d;
    font-weight: bolder;
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #f2f5fa;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  .color {
    color: #1b85cf;
  }
  .case-no {
    color: #9d9d9d;
    font-size: 16px;
    font-weight: bolder;
  }
}
/*详情*/
.detailBox {
  background: #f3f5fa;
}
.detailCont {
  width: 1000px;
  height: 1000px;
  border: 1px solid grey;
  margin: 0 auto;
}
.detailHead {
  width: 1000px;
  height: 120px;
  border: 1px solid grey;
  margin: 0 auto;
}
.detailHead p {
  width: 1000px;
  text-align: center;
  margin: 30px;
}
.detailCenter {
  width: 1000px;
  border: 1px solid black;
  text-align: center;
}
/* 底部 */
.foot {
  margin-top: 20px;
  border-radius: 4px;
  min-height: 36px;
  background: #707070;
}
.foot p {
  float: left;
  line-height: 36px;
  margin-left: 20px;
  font-size: 16px;
}
</style>
