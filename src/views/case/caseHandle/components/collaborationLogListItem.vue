<template>
  <div>
    <div class="item-wrapper" :class="{'last': last}">
      <i class="item-icon el-icon-arrow-right" :class="[showDetail?'go':'aa']" />
      <span class="name">{{ item.createDate | timeDate('YYYY-MM-DD H:m') }}{{ item.content }}</span>
    </div>
    <!-- <div v-if="showDetail" class="detail-wrapper">
      <div v-if="first" class="content">
        <el-row :gutter="20">
          <el-col :span="6">
            <label class="label">协同对象</label>
          </el-col>
          <el-col :span="18">
            <div class="label label1">{{ item.mediaterName || item.courtName }}</div>
            <span class="tip">{{ item.type == 1 ? '主要办案员':'案件协助员' }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <label class="label">事由</label>
          </el-col>
          <el-col :span="18">
            <div class="label">{{ item.reason }}</div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="content">
        <el-row :gutter="20">
          <el-col :span="6">
            <label class="label">接收意见</label>
          </el-col>
          <el-col :span="18">
            <div class="label">{{ acceptText(item.accept) }}</div>
          </el-col>
        </el-row>
        <el-row v-if="item.childMediater || item.childCourt" :gutter="20">
          <el-col :span="6">
            <label class="label">下发</label>
          </el-col>
          <el-col :span="18">
            <div class="label">{{ item.childMediater || item.childCourt }}</div>
          </el-col>
        </el-row>
        <el-row v-if="item.accept === false" :gutter="20">
          <el-col :span="6">
            <label class="label">理由</label>
          </el-col>
          <el-col :span="18">
            <div class="label">{{ item.rejectReason }}</div>
          </el-col>
        </el-row>
        <el-row v-if="last" :gutter="20">
          <el-col :span="6">
            <el-tag v-if="endType == 1" type="danger">协同已拒绝</el-tag>
            <el-tag v-if="endType == 2" type="danger">发起人已结束此次协同</el-tag>
          </el-col>
        </el-row>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    item: {
      type: Object,
      default: null
    },
    last: { // 判断是不是最后一个
      type: Boolean,
      default: false
    },
    first: { // 判断是否第一个
      type: Boolean,
      default: false
    },
    endType: { // 结束方式
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showDetail: false
    }
  },
  computed: {
    acceptText() {
      return function(accept) {
        let text = ''
        if (accept === null) {
          text = ''
        }
        if (accept === false) {
          text = this.item.dept === 0 ? '拒绝' : '退回'
        }
        if (accept === true) {
          text = '接收'
        }
        return text
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.item-wrapper {
  display: flex;
  &.last {
    color: #007AFF;
  }
  color: rgba(0,0,0,0.65);
  line-height: 30px;
  position: relative;
  font-size: 15px;
  font-weight: 400;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: 20px;
  cursor: pointer;
  .item-icon {
    font-size: 15px;
    position: relative;
    font-weight: bold;
    margin-right: 20px;
    top: 9px;
  }
  .name {
    display: inline-block;
    margin-right: 20px;
    font-weight: bold;
  }
  .time {
    display: inline-block;
    font-weight: bold;
    margin-right: 20px;
  }
}
.detail-wrapper {
  width: 100%;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  .content {
    width: 400px;
    margin: 40px auto;
  }
  .label {
    line-height: 1.5;
  }
  .label1 {
    display: inline-block;
  }
  .tip {
    display: inline-block;
    color: rgba(0,151,254,1);
    background-color: rgba(0,151,254,0.1);
    padding: 5px;
    border-radius: 5px;
    margin-left: 10px;
  }
  label.label {
    &::after {
      content: ":"
    }
  }
  div.label {
    word-break: break-all;
  }
  .el-row {
    margin-bottom: 10px;
  }
}
.aa{
  transition: all 0.5s;
}
.go{
  transform:rotate(90deg);
  transition: all 0.5s;
}
</style>
