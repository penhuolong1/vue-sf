<template>
  <div style="margin-top:20px">
    <div class="header1-wrapper">
      <span> 电话录音</span>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="caseNo"
        label="案号"
      />
      <el-table-column
        prop="name"
        label="当事人"
      />
      <el-table-column
        label="电话号码"
        width="140"
      >
        <template slot-scope="scope">
          <div class="phonetext">
            {{ scope.row.phone }}
            <i v-if="scope.row.phone" class="el-icon-view" @click.stop="lookEncryptInfo(scope.row, scope.$index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="文件"
        width="340"
      >
        <template slot-scope="scope">
          <audio class="record-audio" controls :src="scope.row.fileUrl" />
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="拨打时间"
        width="180"
      />
      <el-table-column
        label="通话类型"
      >
        <template slot-scope="scope">
          {{ scope.row.answerType }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
      />
    </el-table>
    <el-pagination
      style="text-align: right;"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalPage"
      @prev-click="prev"
      @next-click="next"
      @current-change="pager"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listCallWav, getPhone } from '@/api/case/index'

export default {
  data() {
    return {
      tableData: [],
      isLoading: true,
      isDetail: false,
      pageNum: 1, // 当前页
      pageSize: 5, // 每页展示多少个
      totalPage: 1, // 总条数
      caseId: null,
      callRow: null, // 选中的录音记录
      visible: false
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
  methods: {
    init() {
      this.caseId = this.getCaseInfo.id
      this.listCallWav()
    },
    listCallWav() {
      const params = {
        caseId: this.caseId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      listCallWav(params).then(res => {
        this.tableData = res.content
        this.totalPage = res.total
        this.isLoading = false
      })
    },
    // 查看电话号码
    lookEncryptInfo(row, index) {
      console.log(row, index)
      const params = {
        callLogId: row.callLogUid
      }
      getPhone(params).then(res => {
        console.log(res)
        if (res.state == 100) {
          this.tableData[index].phone = res.phone
        }
      })
    },
    // 新增和修改成功
    success() {
      this.listCallWav()
    },
    // 上一页
    prev() {
      this.pageNum--
      this.listCallWav()
    },
    // 下一页
    next() {
      this.pageNum++
      this.listCallWav()
    },
    // 第几页
    pager(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.listCallWav()
    }
  }

}
</script>
<style scoped lang="scss">
.header1-wrapper {
  height: 35px;
  line-height: 35px;
  span {
    color: #007AFF;
    font-weight: bold;
    font-size: 16px;
  }
}

</style>
