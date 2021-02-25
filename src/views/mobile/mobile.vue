<template>
  <div ref="box" class="box">
    <nav>案件详情</nav>
    <div ref="mobile" class="mobile">
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>解纷号：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.dCaseNo || form.sqCaseNo }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>受理日期：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.registerDate }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>纠纷事由：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.brief }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>纠纷金额：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.applyStandard }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>受理单位：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.registerCourt }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>解纷机构：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.courtName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>解纷员：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.mediator }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>解纷时间：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.mediateTime }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>申请人：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.applicants }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item">
        <el-col :span="8">
          <span>被申请人：</span>
        </el-col>
        <el-col :span="16" style="text-align: right;">
          <span>{{ form.respondents }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="item" style="border: none;">
        <el-col :span="8">
          <span>案件日志：</span>
        </el-col>
      </el-row>
      <el-row class="item" style="border: none;">
        <el-timeline ref="item" :reverse="reverse">
          <el-timeline-item
            v-for="(item, index) in form.caseLog.content"
            :key="index"
            :timestamp="item.timestamp"
            placement="top"
            :color="color"
          >
            <div>
              <el-card>
                <p>内容：{{ item.operateContent }}</p>
                <p>操作人:{{ item.operateName }}</p>
              </el-card>
            </div>
          </el-timeline-item>
        </el-timeline>
        <p style="text-align: center;">没有更多数据了</p>
      </el-row>
    </div>
  </div>
</template>

<script>
import { qrCodeCaseInfo } from '@/api/case'
export default {
  name: 'Mobile',
  data() {
    return {
      reverse: true,
      color: '#176BEA',
      form: {
        sqCaseNo: '',
        applicants: '', // 申请人
        respondents: '', // 被申请人
        registerCourt: '', // 审核机构
        courtName: '', // 受理机构
        mediateTime: '', // 解纷时间
        mediateRequest: '', // 纠纷请求
        applyStandard: '', // 涉及金额
        mediator: '', // 解纷员
        registerDate: '', // 受理时间
        caseLog: {
          content: []
        }
      },
      pageNum: 1,
      caseId: '',
      totalPages: 1,
      loading: true
    }
  },
  mounted() {
    this.getCaseInfo()
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.listenerFunction)
  },
  methods: {
    async getCaseInfo() {
      const [, caseId] = window.location.href.split('?caseId=')
      this.caseId = caseId
      await qrCodeCaseInfo(this.caseId).then((res) => {
        this.form = res
        this.totalPages = res.caseLog.totalPages
      })
      this.form.caseLog.content = this.form.caseLog.content.map((item) => {
        return {
          ...item,
          timestamp: this.exChange(item.createDate)
        }
      })
    },
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${
        myDate.getMonth() + 1
      }-${myDate.getDate()}   ${myDate.getHours()}:${
        myDate.getMinutes() < 10
          ? '0' + myDate.getMinutes()
          : myDate.getMinutes()
      }`
    }
  }
}
</script>

<style scoped lang = "scss">
.box {
  width: 100%;
  height: 100%;
}
nav {
  height: 60px;
  background-color: #176bea;
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-weight: bold;
}
.mobile {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  padding: 10px;
  background-color: #fff;
}
.item {
  height: 50px;
  line-height: 50px;
  /* height: 1rem;
    line-height: 1rem; */
  border-bottom: 1px solid #f1f2f4;
  width: 95%;
  margin: 0 auto !important;
  .el-col-16 {
    text-align: right;
    @extend .ellipsis;
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item {
  height: 20px;
}
</style>
