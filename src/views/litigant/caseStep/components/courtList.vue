<template>
  <div class="select-wrapper">
    <a v-show="!isDetail" class="el-icon-close" @click="closeList" />
    <a v-show="isDetail" class="el-icon-close" @click="closeList" />
    <a v-show="isDetail" class="el-icon-arrow-left" @click="closeDetail" />
    <ul v-show="!isDetail" v-loading="loading">
      <li v-for="(item, index) in courtData" :key="index" class="select-item" @click="selectCourt(item)">
        <div class="select-item-left">
          <img src="@/assets/img/court.png">
        </div>
        <div class="select-item-right">
          <div class="title">{{ item.name }}</div>
          <div class="num">解纷员数量：{{ item.mediater }}</div>
          <div class="specialty">专业领域：{{ item.scope }}</div>
          <a @click.stop="showDetailClick(item.id)">详情<i class="el-icon-arrow-right" /></a>
        </div>
      </li>
    </ul>
    <div v-show="isDetail" class="detail-wrapper">
      <div class="wrapper">
        <div class="wrapper-left" />
        <div class="wrapper-right">
          <div class="title">{{ detailObj.name }}</div>
          <div class="address">地址：{{ detailObj.address }}</div>
          <div class="phone">联系方式：{{ detailObj.linkMan }}  {{ detailObj.phone }}</div>
          <div class="num">解纷员数量：{{ detailObj.mediater }}</div>
        </div>
      </div>
      <div class="content">
        <p>组织简介: {{ detailObj.introduction }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopThreeCourt } from '@/api/litigant/litigant'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      isDetail: false,
      courtData: [],
      detailObj: {},
      loading: false
    }
  },
  computed: {
    registerCourt() {
      return this.$store.state.litigant.registerCourt.id
    }
  },
  watch: {
    registerCourt() {
      if (this.registerCourt) {
        if (this.registerCourt) {
          this.getTopThreeCourt()
          this.$emit('showList')
        }
      }
    }
  },
  created() {
    // this.getTopThreeCourt()
    if (this.$store.state.litigant.courtData.id) {
      this.$emit('closeList')
    }
    this.getTopThreeCourt()
  },
  mounted() {

  },
  methods: {
    // 关闭整个列表
    closeList() {
      this.$emit('closeList')
    },
    // 关闭整个详情
    closeDetail() {
      this.isDetail = false
    },
    // 显示详情
    showDetailClick(id) {
      this.detailObj = this.courtData.find(item => item.id == id)
      this.isDetail = true
    },
    // 获取解纷组织
    getTopThreeCourt() {
      const params = {
        // courtId: this.$store.state.litigant.registerCourt.id,
        target: this.$store.state.litigant.briefName
      }
      this.loading = true
      getTopThreeCourt(params).then(res => {
        this.loading = false
        if (res.state === 100) {
          this.courtData = res.data
        }
        console.log(this.courtData)
      })
    },
    // 选择组织解纷
    selectCourt(item) {
      const data = {
        id: item.id,
        name: item.name
      }
      this.$store.commit('SET_COURTDATA', data)
      this.$store.commit('SET_MEDIATOR', {})
      this.$emit('closeList')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.select-wrapper {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    min-height: 200px;
    background-color: rgba(255,255,255, 0.1);
    z-index: 2;
    backdrop-filter: blur(20px) brightness(110%);
    .el-icon-close {
      color: $themeColor;
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .el-icon-arrow-left {
      position: absolute;
      top: 5px;
      right: 30px;
      color: #BDBDBD;
    }
    ul {
      .select-item {
        display: flex;
        width: 100%;
        cursor: pointer;
        margin-top: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #DFDEDE;
        .select-item-left {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          background-color: #f5f5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 70px;
          }
        }
        .select-item-right {
          flex: 1;
          padding-left: 10px;
          flex-shrink: 1;
          width: 100%;
          overflow:hidden;
          position: relative;
          &>div {
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            font-size: 14px;
            margin-bottom: 12px;
            color: #212121;
            &:last-child {
              margin-bottom: 0px;
            }
            &:first-child {
              margin-top: 4px;
            }
          }
          a {
            color: $themeColor;
            position: absolute;
            top: 30px;
            right: 20px;
            font-size: 14px;
          }
        }
      }
    }
    .detail-wrapper {
      padding-top: 40px;
      .wrapper {
        display: flex;
        .wrapper-left {
          width: 100px;
          height: 130px;
          background-color: #f5f5f5;
        }
        .wrapper-right {
          padding-left: 10px;
          font-size: 14px;
          &>div {
            margin-bottom: 10px;
            &:first-child {
              margin-top: 5px;
            }
            &:last-child {
              margin-bottom: 0px;
            }
          }
        }
      }
      .content {
        padding-top: 10px;
        font-size: 14px;
        color: #212121;
        line-height: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        line-clamp: 5;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
