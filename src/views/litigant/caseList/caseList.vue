<template>
  <div style="overflow:auto;">
    <div class="search-item" style="width: 100%;">
      <div class="search-wrapper">
        <el-input v-model="searchParams.sqCaseNo" type="text" placeholder="案号" />
        <div class="search-btn-wrapper">
          <!-- <el-button>批量</el-button> -->
          <el-button @click="getCaseList">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="menu-wrapper">
      <ul>
        <li :class="{'active': menu1 == 92}" @click="selectMenu1(92)">已申请</li>
        <li :class="{'active': menu1 == 0}" @click="selectMenu1(0)">未申请</li>
      </ul>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      class="table"
    >
      <el-table-column
        prop="applyType"
        label="案件类型"
      />
      <el-table-column
        prop="dCaseNo"
        label="案号"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.sqCaseNo || scope.row.dCaseNo }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="申请人/被申请人"
      >
        <template slot-scope="scope">
          <p>申请人:{{ scope.row.applicant }}</p>
          <p>被申请人:{{ scope.row.respondent }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="briefName"
        label="纠纷事由"
      />
      <el-table-column
        prop="applyStandard"
        label="纠纷金额(元)"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <template slot-scope="scope">
          <div class="opera-btn">
            <a style="margin-right: 10px;" @click="getDetail(scope.row.id)">详情</a>
            <a v-if="scope.row.process < 1" style="margin-right: 10px;" @click="delList(scope.row.id)">删除</a>
            <!-- 设置当案件未受理之前都可以修改 并且登陆的人为当前案件的提供人 -->
            <a v-if="scope.row.process < 2 && getUserInfo.result.id == scope.row.userId" @click="update(scope.row.id, scope.row)">{{ scope.row.process == -1 ? '补正':'修改' }}</a>
            <a v-if="scope.row.process == 5" @click="toMediationRoom(scope.row.id)">进入解纷</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <el-pagination
        background
        :page-size="searchParams.pageSize"
        :pager-count="5"
        layout="sizes, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :total="listCastTotal"
        @size-change="handleSizeChange"
        @prev-click="caseListPrev"
        @next-click="caseListNext"
        @current-change="caseListPage"
      />
    </div>
  </div>
</template>

<script>
import { listCase } from '@/api/litigant/litigant'
import { intoTalkRoom, deleteCase } from '@/api/case/index.js'
import { inRecord, verifyHasCard } from '@/api/mediater/mediater.js'
import { intoRoom, joinGroup } from '@/api/rtcRoom/rtcRoom.js'
import { mapGetters } from 'vuex'
export default {
  props: {

  },
  data() {
    return {
      menu1: 92, // 92 已申请 0 未申请
      options: [],
      value: '',
      tableData: [],
      searchParams: {
        pageSize: 10,
        pageNumber: 1
      },
      loading: true,
      listCastTotal: 0, // 案件列表总数
      applyTypeData: [
        {
          value: '解纷',
          label: '解纷'
        },
        {
          value: '仲裁',
          label: '仲裁'
        },
        {
          value: '行政复议',
          label: '行政复议'
        },
        {
          value: '行政裁决',
          label: '行政裁决'
        },
        {
          value: '其他',
          label: '其他'
        }
      ]
    }
  },
  created() {
    this.getCaseList()
  },
  mounted() {

  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    reset() {
      this.searchParams = {
        pageSize: 20,
        pageNum: 1
      }
      this.getCaseList()
    },
    // 获取案件列表信息
    getCaseList() {
      this.searchParams.process = this.menu1
      listCase(this.searchParams).then(res => {
        this.loading = false
        if (res.state === 100) {
          this.listCastTotal = res.data.total
          this.tableData = res.data.content.map((item, index) => {
            item.num = index + 1
            item.applicant = res.litigants[index][1]
            item.respondent = res.litigants[index][2]
            item.userId = res.apply[index].applicantId
            return item
          })
        }
      })
    },
    // 跳转详情
    getDetail(id) {
      this.$store.commit('SET_CASEID', id)
      this.$router.push('/case')
    },
    // 分流
    shunt(id) {},
    // 改变一页显示多少条
    handleSizeChange(e) {
      this.searchParams.pageSize = e
      this.searchParams.pageNumber = 1
      this.getCaseList()
    },
    // 上一页
    caseListPrev(index) {
      console.log('----上一页---------')
      this.searchParams.pageNumber = index
      this.getCaseList()
    },
    // 下一页
    caseListNext(index) {
      this.searchParams.pageNumber = index
      this.getCaseList()
    },
    // 选择第几页
    caseListPage(index) {
      this.searchParams.pageNumber = index
      this.getCaseList()
    },
    // 修改
    update(id, data) {
      console.log(data)
      this.$store.commit('SET_CASEID', id)
      this.$store.commit('SET_FROMSCAN', data.fromScan ? data.fromScan : '')
      window.localStorage.setItem('lawCaseId', id)
      this.$router.push({ name: 'step1' })
    },
    async intoRoom(id) {
      let token = ''
      await intoRoom({ caseId: id }).then(res => {
        // this.$emit('getRoomToken')
        token = res.result
      })
      this.$store.commit('SET_ROOMTOKEN', token)
    },
    // 跳转到解纷室
    async toMediationRoom(id, sqCaseNo) {
      // joinGroup({ caseId: id, loginId: this.getUserInfo.result.id })
      verifyHasCard({ lawCaseId: id }).then(async res => {
        if (res.state == 100) {
          this.intoRoom(id)
          this.$router.push({
            path: '/rtcRoom',
            query: {
              id
            }
          })
        }
      })
    },
    // 删除案件
    delList(id) {
      this.$confirm('是否确认删除该案件')
        .then(_ => {
          deleteCase({ caseId: id }).then(res => {
            if (res.state === 100) {
              this.$message.success(res.message)
              this.getCaseList()
            }
          })
        }).catch(() => {

        })
    },
    //
    selectMenu1(index) {
      this.menu1 = index
      this.getCaseList()
    }
  }
}
</script>

<style scoped lang="scss">
.search-wrapper {
  padding: 20px 30px;
  padding-right: 300px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 5px solid #F2F5FA;
  position: relative;
  ::v-deep .el-select {
    width: 150px;
    margin-right: 12px;
  }
  ::v-deep .el-input {
    width: 150px;
    margin-right: 12px;
    margin-bottom: 10px;
  }
  ::v-deep .el-date-editor .el-range-separator {
    width: auto;
  }
  .search-btn-wrapper {
    position: absolute;
    right: 30px;
    top: 20px;
    ::v-deep .el-button {
      &:nth-child(1) {
        background-color: #F9BC01;
        color: #FFf;
      }
      &:nth-child(2) {
        background-color: #007AFF;
        color: #FFf;
      }
      &:nth-child(3) {
        border-color: #007AFF;
        color: #007AFF;
      }
    }
  }
}
.menu-wrapper {
  ul {
    display: flex;
    padding: 0px 30px;
    li {
      &.active {
        color: #007aff;
        border-bottom: 5px solid #007aff;
      }
      padding: 20px 0;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  border-bottom: 5px solid #F2F5FA;
}
.page-wrapper {
  text-align: right;
  padding-top: 30px;
  border-top: 5px solid #F2F5FA;
}
</style>
