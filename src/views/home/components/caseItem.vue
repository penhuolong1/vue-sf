<template>
  <li>
    <p class="title" @click="goDetail">{{ newsDetail.name }}</p>
    <p class="item-box">
      类型：<span>{{ newsDetail.type }}</span>
      <!-- 日期：<span>{{ newsDetail.expirationDate }}</span> -->
      分类：<span>{{ newsDetail.category }}</span>
    </p>
    <p class="caseNo">
      {{ newsDetail.number }}
    </p>
  </li>
</template>

<script>
import { lawDetail } from '@/api/case'
export default {
  name: 'NewsItem',
  props: {
    newsDetail: {
      type: Object,
      default: () => ({
        title: '',
        type: '',
        expirationDate: '',
        number: '',
        id: ''
      })
    }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  created() {
    console.log(this.newsDetail)
  },
  mounted() {

  },
  methods: {
    goDetail() {
      lawDetail(this.newsDetail.id).then(res => {
        if (res.state === '100') {
          this.$router.push({
            name: 'caseInquiryDetail',
            params: res.data
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  $basic-color: #1B85CF;
  .title {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 22px;
    height: auto;
    min-height: 50px;
    line-height: 50px;
    color: #212121;
    cursor: pointer;
    &:hover{
      text-decoration:underline;
      color:$basic-color;
    }
  }
  .item-box {
    height: 50px;
    line-height: 50px;
    color: #9D9D9D;
    span{
      margin-right:10px;
      font-size:14px;
    }
    span:nth-child(1){
      color:$basic-color;
    }
    span:nth-child(3){
      color:$basic-color;
    }
  }
  .caseNo {
    font-size:14px;
    color: #9D9D9D;
  }
</style>
