<template>
  <div class="commend-wrapper">
    <img class="commend-img" src="@/assets/img/commend.png">
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="wrapper">
          <div class="desc">申请人未选择解纷组织及解纷员，可通过智能推荐功能匹配</div>
          <div class="form-item">
            <label>解纷组织</label>
            <el-input v-model="getCaseInfo.courtTempName" type="text" disabled />
          </div>
          <div class="form-item">
            <label>解纷员</label>
            <el-input v-model="getCaseInfo.mediaterTempName" type="text" disabled />
          </div>
          <!-- <div v-if="!getCaseInfo.courtTempId && !getCaseInfo.mediaterTempId" class="text"> -->
          <el-button class="btn" type="primary" round size="mini" @click="setRecommend">智能推荐</el-button>
          <!-- </div> -->
        </div>
      </el-col>
      <el-col :span="12" class="border-right">
        <div class="header">
          <ul>
            <i v-if="listNum !== 0" class="el-icon-arrow-left" @click="prev" />
            <li v-for="(item, index) in getList" :key="index" :class="{'active': index == lineNum}" @click="selectLine(index)">{{ item.name }}</li>
            <i v-if="listNum !== list1.length/3-1 && list1.length > 3" class="el-icon-arrow-right" @click="next" />
          </ul>
        </div>
        <div class="content">
          <Steps direction="vertical">
            <Step v-for="(item, index) in list[lineNum]" :key="index" :title="item.name" />
          </Steps>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUpCourtByMan, setRecommend } from '@/api/case/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      list: [],
      list1: [
        {
          name: '路线1'
        }
      ],
      listNum: 0,
      lineNum: 0 // 目前显示第几条路线
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getUserInfo']),
    isShowCom() { // 如果有推荐的调解组织和调解员就显示推荐路线
      let flag = false
      if (this.getCaseInfo.courtTempId || this.getCaseInfo.mediaterTempId) {
        flag = true
      }
      return flag
    },
    getList() {
      return this.list1.slice(this.listNum * 3, this.listNum * 3 + 3)
    }
  },
  created() {
    this._getUpCourtByMan()
  },
  mounted() {

  },
  methods: {
    // 获取推荐路线
    _getUpCourtByMan(id) {
      if (!id) {
        if (!this.isShowCom) {
          return
        }
      }
      const params = {
        mediaterId: id || this.getCaseInfo.mediaterTempId,
        caseId: this.getCaseInfo.id
      }
      getUpCourtByMan(params).then(res => {
        if (res.state === 100) {
          const length = res.data.list.length
          this.list1 = []
          for (let i = 1; i <= length; i++) {
            const obj = {
              name: `路线${i}`
            }
            this.list1.push(obj)
          }
          this.list = res.data.list
        }
      })
    },
    // 路线下一页
    next() {
      if (this.listNum == this.list1.length / 3 - 1) {
        return
      }
      this.listNum++
    },
    // 路线上一页
    prev() {
      if (this.listNum == 0) {
        return
      }
      this.listNum--
    },
    // 选择路线
    selectLine(index) {
      this.lineNum = index
    },
    // 智能推荐
    setRecommend() {
      setRecommend({ caseId: this.getCaseInfo.id }).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this._getUpCourtByMan(res.data.mediaterTempId)
          this.$store.dispatch('GetCaseInfo')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.commend-wrapper {
  ::v-deep.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: #ccc;
    background-color: transparent;
    color: #ccc;
    span {
      color: #ccc!important;
    }
  }
  ::v-deep.ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
    color: #999;
  }
  position: relative;
  height: 100%;
  .commend-img {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
  }
  .el-row {
    height: 100%;
  }
  .border-right {
    height: 100%;
    border-left: 1px solid rgba(112,112,112,0.3);;
  }
  .wrapper {
    padding-left: 20px;
    .desc {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #000000;
      line-height: 1.2;
      margin-top: 55px;
      margin-bottom: 20px;
    }
    .form-item {
      label {
        width: 100px;
        font-size: 14px;
        color: #000;
      }
    }
    .text {
      margin-bottom: 30px;
      margin-top: 10px;
      label {
        font-size: 14px;
        color: #007AFF;
      }
      .btn {
        background-color: #007AFF;
        margin-left: 10px;
      }
    }
  }
  .header {
    margin-top: 20px;
    ul {
      display: flex;
      padding: 0px 20px;
      li {
        flex: 1;
        font-size: 14px;
        color: #000000;
        cursor: pointer;
        text-align: center;
        &.active {
          color: #007AFF;
        }
      }
    }
    i {
      cursor: pointer;
    }
  }
  .content {
    min-height: 200px;
    ::v-deep.ivu-steps {
      margin: 20px auto;
    }
    ::v-deep.el-step {
      height: 50px;
    }
  }
}
</style>
