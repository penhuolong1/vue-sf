<template>
  <div>
    <div class="title">
      <span>
        首页
      </span>/
      <span>
        {{ type }}
      </span>/
      <span>{{ detail.name }}</span>
      <el-button type="text" style="float: right;position: relative;top: 8px;" @click="search">返回</el-button>
    </div>
    <div class="detail-box">
      <p>{{ detail.name }}</p>
      <!-- <p>
        <span>
          日期：{{ detail.issueDate }}
        </span>
        <span>
          来源：{{ detail.issueUnits }}
        </span>
        <span>
          发布号：{{ detail.number }}
        </span>
      </p> -->
      <div class="content" v-html="detail.content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      // detail: {
      //   type: '',
      //   title: '',
      //   expirationDate: '',
      //   content: '',
      //   issueUnits: ''
      // }
      type: '纠纷',
      detail: {
        name: '',
        content: ''
      }
    }
  },
  computed: {

  },
  mounted() {
    this.detail = this.$route.params
  },
  methods: {
    getList(word) {
      this.$router.push({
        name: 'caseInquiryList',
        params: { word }
      })
    },
    search() {
      this.$router.push({
        name: 'caseInquiryList'
      })
    }
  }
}
</script>

<style scoped lang = "scss">
.title {
  height: 60px;
  line-height: 60px;
  margin: 0 auto;
  width: 75%;
  font-family: Source Han Sans CN;
  font-weight: 700;
  color: rgba(136,136,136,1);
  span:nth-child(2){
    color:#888888;
  }
  span:nth-child(3){
    color:#1B85CF;
  }
}
.detail-box {
  width: 75%;
  height: auto;
  padding: 30px;
  background: white;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
  border-top: 3px solid #1B85CF;
  margin: 0 auto;
  margin-bottom: 30px;
  p:nth-child(1){
    width: 80%;
    margin: 0 auto;
    text-align: center;
    font-size: 25px;
    min-height: 50px;
    line-height: 50px;
    font-family: Source Han Sans CN;
    border-bottom: 1px solid #DEDEDE;
    font-weight: 400;
    color: rgba(33,33,33,1);
  }
  p:nth-child(2){
    width: 80%;
    min-height: 50px;
    line-height: 50px;
    margin: 0 auto;
    text-align: center;
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
.content {
  width: 80%;
  padding: 20px;
  margin: 0 auto;
  line-height: 30px;
}
</style>
