<template>
  <div class="record-wrapper">
    <!-- <header style="margin-bottom: 20px;">
      <h2>案号： {{title}}</h2>
    </header> -->
    <el-timeline v-show="timeData && timeData.length > 0">
      <el-timeline-item v-for="(item, index) in timeData" :key="index" :timestamp="item.createDate" placement="top">
        <el-card>
          <h4>{{ item.operateContent }}</h4>
          <p>操作人:{{ item.operateName }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <p v-show="!timeData || timeData.length == 0" class="no-data">暂无数据</p>
  </div>
</template>

<script>
import { listCaseLog } from '@/api/case/index'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
  },
  data() {
    return {
      timeData: [],
      caseId: null
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo'])
  },
  watch: {
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    // 初始化数据
    init() {
      this.caseId = this.getCaseInfo.id
      this.getListCaseLog()
    },
    getListCaseLog() {
      const params = {
        pageSize: 1000,
        pageNum: 1,
        caseId: this.caseId
      }
      listCaseLog(params).then(res => {
        this.timeData = res.content
        this.timeData.forEach(item => {
          item.createDate = formatDate(item.createDate, 'YYYY-MM-DD H:m')
        })
        console.log(this.timeData)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.record-wrapper {
  width: 100%;
  background-color: #fff;
  padding: 20px;
}
.no-data {
  text-align: center;
  font-size: 17px;
  color: #999;
}
</style>
