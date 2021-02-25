<template>
  <div class="select-wrapper">
    <a v-show="!isDetail" class="el-icon-close" @click="closeList" />
    <a v-show="isDetail" class="el-icon-close" @click="closeList" />
    <a v-show="isDetail" class="el-icon-arrow-left" @click="closeDetail" />
    <ul v-show="!isDetail">
      <li v-for="(item, index) in unitArr" :key="index" class="select-item" @click="selectUnit(item)">
        <div class="select-item-left">
          <img src="@/assets/img/court.png">
        </div>
        <div class="select-item-right">
          <div class="title">{{ item.name }}</div>
          <div class="num" />
          <div class="specialty" />
          <!-- <a @click.stop="showDetailClick">详情<i class="el-icon-arrow-right" /></a> -->
        </div>
      </li>
    </ul>
    <div v-show="isDetail" class="detail-wrapper">
      <div class="wrapper">
        <div class="wrapper-left" />
        <div class="wrapper-right">
          <div class="title">福建联合信实律师事务所律师解纷工作室</div>
          <div class="address">地址：厦门市思明区仙岳路396-398号翔业大厦写字楼9层</div>
          <div class="phone">联系方式：罗淞  15880216225</div>
          <div class="num">解纷员数量：10+</div>
          <div class="num">年解纷数：1000+件</div>
        </div>
      </div>
      <div class="content">
        <p>组织简介:</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getMediater } from '@/api/common/common'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      isDetail: false,
      unitArr: []
    }
  },
  created() {
    this.getMediater()
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
    showDetailClick() {
      this.isDetail = true
    },
    // 获取受理单位
    getMediater() {
      getMediater({ courtType: 1 }).then(({ content }) => {
        if (!this.$store.state.litigant.registerCourt.id) { // 如果没机构默认市中级法院
          const item = {
            id: '32a05765fd7f45099d616ec00cbc2539',
            name: '市中级法院'
          }
          this.$store.commit('SET_COURT', item)
        }
        this.unitArr = content.filter((item, index) => {
          return index < 3
        })
        console.log(this.unitArr)
      })
    },
    // 选择受理单位
    selectUnit(item) {
      this.$emit('closeList')
      this.$store.commit('SET_COURTDATA', {})
      this.$store.commit('SET_MEDIATOR', {})
      this.$store.commit('SET_COURT', item)
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
        margin-top: 20px;
        padding-bottom: 15px;
        cursor: pointer;
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
