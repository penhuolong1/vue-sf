<template>
  <div>
    <div class="item-wrapper" :class="{'last': last}" @click="showDetail = !showDetail">
      <i class="item-icon el-icon-arrow-right" :class="[showDetail?'go':'aa']" />
      <span class="name">{{ item.head }}</span>
      <span class="time">{{ item.createDate | time }}</span>
    </div>
    <div v-if="showDetail" class="detail-wrapper">
      <div class="content">
        <div v-show="item.process == '-1'">
          <div v-show="itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">补正理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-show="!itemData.backOpinoin" style="text-align: center;">暂无</div>
        </div>
        <!-- 分流阶段 -->
        <div v-show="item.process == 0">
          <div style="text-align: center;">暂无</div>
        </div>
        <div v-show="item.process == 1">
          <div v-show="!itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ resultMap[4] }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">受理单位</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.acceptUnit }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-show="itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ backText }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">回退理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 审核和分发阶段 -->
        <div v-show="item.process == 2">
          <div v-if="itemData.acceptance > 0">
            <div v-if="itemData.acceptance != 5">
              <el-row :gutter="20">
                <el-col :span="6">
                  <label class="label">接收意见</label>
                </el-col>
                <el-col :span="18">
                  <div class="label">{{ acceptText }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <label class="label">分发意见</label>
                </el-col>
                <el-col :span="18">
                  <div class="label">{{ distributionText }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <label class="label">审核意见</label>
                </el-col>
                <el-col :span="18">
                  <div class="label">{{ resultMap[itemData.acceptance] }}</div>
                </el-col>
              </el-row>
            </div>
            <el-row v-if="itemData.acceptance == 1" :gutter="20">
              <el-col :span="6">
                <label class="label">诉非号</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.sq_case_no }}</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.acceptance == 1" :gutter="20">
              <el-col :span="6">
                <label class="label">事由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.briefName }}</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.acceptance == 2 || itemData.acceptance == 3 " :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.acceptance == 2 || itemData.acceptance == 3 " :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
            <!-- 退回 -->
            <el-row v-if="itemData.acceptance == 5 " :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">退回</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.acceptance == 5 " :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ backText }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 分配阶段 -->
        <div v-show="item.process == 3">
          <div v-if="!itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ acceptText }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">解纷组织</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.acceptUnit }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ backText }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 分配阶段 -->
        <div v-show="item.process == 4">
          <div v-if="!itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.accept ? '接收':'下发' }}</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.acceptUnit" :gutter="20">
              <el-col :span="6">
                <label class="label">解纷员</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.acceptUnit }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ backText }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 化解结果 -->
        <div v-show="item.process == 6">
          <div v-if="!itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">化解结果</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.result }}</div>
              </el-col>
            </el-row>
            <el-row v-if="itemData.otherTypeRemark" :gutter="20">
              <el-col :span="6">
                <label class="label">其他事由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.otherTypeRemark }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">化解时间</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.endDate }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-if="itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-show="item.process == 7">
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">接收意见</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.receiveOpinion }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">理由</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.backOpinoin }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 移送法院 -->
        <div v-show="item.process == 8">
          <div v-if="itemData.result">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">赋强类型</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.result }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">申请立案</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.register }}</div>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">移送时间</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.endDate }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">移送法院</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.moveCourtName }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 结案 -->
        <div v-show="item.process == 9">
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">接收意见</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.receiveOpinion || '接收' }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 移送法院 -->
        <div v-show="item.process == 10">
          <div v-if="itemData.backOpinoin">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.receiveOpinion }}</div>
              </el-col>
              <el-col :span="6">
                <label class="label">理由</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.backOpinoin }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="label">接收意见</label>
              </el-col>
              <el-col :span="18">
                <div class="label">{{ itemData.receiveOpinion }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-show="item.process == 11">
          <el-row :gutter="20">
            <el-col :span="6">
              <label class="label">接收意见</label>
            </el-col>
            <el-col :span="18">
              <div class="label">{{ itemData.backOpinoin }}</div>
            </el-col>
            <!-- <el-col v-if="itemData.backOpinoin" :span="6">
              <label class="label">理由</label>
            </el-col>
            <el-col v-if="itemData.backOpinoin" :span="18">
              <div class="label">{{ itemData.backOpinoin }}</div>
            </el-col> -->
          </el-row>
        </div>
        <div v-show="item.process == '99'">
          <div style="text-align: center;">暂无</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/format.js'
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
    }
  },
  data() {
    return {
      showDetail: false,
      result: '',
      resultMap: {
        1: '同意',
        2: '不予受理',
        3: '补正',
        4: '下发'
      },
      backText: '退回',
      acceptText: '接收',
      distributionText: '自行受理',
      itemData: {}
    }
  },
  computed: {

  },
  watch: {
    item() {
      this.result = this.resultMap[this.item.result] || '无'
      this.itemData = this.item
      this.itemData.date = formatDate(new Date(this.itemData.date).getTime())
      this.itemData.endDate = formatDate(new Date(this.itemData.endDate).getTime())
      this.itemData.register = this.itemData.register ? '是' : '否'
    }
  },
  created() {
    console.log(this.item)
    this.itemData = this.item
    this.itemData.date = formatDate(new Date(this.itemData.date).getTime())
    this.itemData.endDate = formatDate(new Date(this.itemData.endDate).getTime())
    this.itemData.register = this.itemData.register ? '是' : '否'
  },
  mounted() {
    this.result = this.resultMap[this.item.result] || '无'
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.item-wrapper {
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
