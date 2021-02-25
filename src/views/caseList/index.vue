<template>
  <div class="case-list-wrapper">
    <div class="left-wrapper">
      <menuLeft ref="menuLeft" :menu-data="menuData" @selectMenu="selectMenu" />
    </div>
    <div class="right-wrapper">
      <div class="search-item">
        <div class="search-wrapper">
          <el-select v-if="selectType != 5" v-model="searchParams.dealType" clearable placeholder="案件状态" @click.stop="" @clear="clearDealType">
            <el-option
              v-for="item in dealTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="searchParams.caseSource" placeholder="案件来源" clearable>
            <el-option
              v-for="item in caseSourceData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="searchParams.applyType" placeholder="案件类型" clearable>
            <el-option
              v-for="item in applyTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="searchParams.sqCaseNo" type="text" placeholder="案号" clearable />
          <el-input v-model="searchParams.litigantName" type="text" placeholder="申请人/被申请人" clearable />
          <brief ref="brief" v-model="searchParams.briefId" class="se-brief" />
          <el-select v-model="searchParams.order " placeholder="创建时间" clearable @clear="clearOrder">
            <el-option
              v-for="item in orderData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 解纷员没这个搜索条件 -->
          <elSelectTree v-if="isNeedHandleUnit" ref="elSelectTree" v-model="searchParams.flowCourtId" :is-case-list="true" :placeholder="'请选择受理单位'" :type="teamType" style="width: 300px" @getRadio="getRadio" />
          <el-select v-if="selectType != 5" v-model="searchParams.yetGoalId" filterable remote :remote-method="getListGoalByName" :loading="loading" clearable placeholder="当前办理">
            <el-option
              v-for="item in listGoalData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="searchTime"
            type="daterange"
            range-separator="/"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
          />
          <div class="search-btn-wrapper">
            <!-- <el-button>批量</el-button> -->
            <el-button size="mini" @click="search">搜索</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
          </div>
        </div>
      </div>
      <div class="list-wrapper-wrapper">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          class="table"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="num"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="caseSource"
            label="案件来源"
          />
          <el-table-column
            prop="applyType"
            label="案件类型"
          />
          <el-table-column
            prop="dCaseNo"
            :label="selectType < 3 ? '登字号/案号':'案号'"
          >
            <template slot-scope="scope">
              {{ scope.row.sqCaseNo||scope.row.dCaseNo }}
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
            :label="selectType < 3 ? '登记/受理日期':'受理日期'"
            sortable
            :sort-method="sortTime"
          >
            <template slot-scope="scope">
              {{ scope.row.acceptanceDate | timeDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="案件状态"
          />
          <el-table-column
            prop="dealUser"
            label="当前办理"
          />
          <el-table-column
            prop="address"
            label="操作"
          >
            <template slot-scope="scope">
              <div class="opera-btn">
                <!-- <a @click="getDetail(scope.row.id)">详情</a><span>|</span><a @click="shunt(scope.row.id)">分流</a> -->
                <a @click="getDetail(scope.row.id)">详情</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper">
        <el-pagination
          background
          :current-page="searchParams.pageNum"
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
  </div>
</template>

<script>
import elSelectTree from '@/components/el-select-tree/index'
import brief from '@/components/brief/index.vue'
import { PROCESSMAP, CASETYPE } from '@/utils/constVal.js'
import menuLeft from '@/components/menu/menuLeft.vue'
import { listCase2, getCaseSource, listGoalByName } from '@/api/case/index.js'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  name: 'CaseList',
  components: {
    menuLeft,
    brief,
    elSelectTree
  },
  props: {

  },
  data() {
    return {
      teamType: 2,
      showMenu: false,
      menu1: 2,
      processMap: PROCESSMAP,
      dealTypeData: [
        {
          value: 0,
          label: '全部案件'
        },
        {
          value: 1,
          label: '待办理'
        },
        {
          value: 2,
          label: '已办理'
        }
      ],
      menuData: [
        { name: '全部案件' },
        { name: '解纷' },
        { name: '协同' },
        { name: '法院赋强' },
        { name: '法院立案' },
        { name: '结案' }
      ],
      caseSourceData: [
      ],
      applyTypeData: [],
      endTypes: ['当事人达成和解', '当事人撤诉'],
      orderData: [{
        value: 'desc',
        label: '创建时间降序'
      }, {
        value: 'asc',
        label: '创建时间升序'
      }],
      value: '',
      tableData: [],
      searchParams: {
        pageSize: 10,
        pageNum: 1,
        dealType: 1,
        order: 'desc'
      },
      loading: true,
      listCastTotal: 0, // 案件列表总数
      briefData: [],
      searchTime: null,
      process: null,
      flowStatus: null,
      selectType: 0,
      courtData: [],
      listGoalData: [],
      selfType: 1 // 1本单位 2 本单位及其下级
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getUserRole', 'getCourtId']),
    isNeedHandleUnit() { // 是否需要受理案件的搜索条件
      let flag = true
      if (this.getUserInfo.roleType == 2) { // 调解员不需要
        flag = false
      } else {
        if (this.getUserInfo.courtType == 2) { // 调解组织不需要
          flag = false
        } else if (this.getUserInfo.courtType == 0 && this.searchParams.dealType == 1) { // 当为联动中心是 在带办理的时候不需要这个搜索条件
          flag = false
        }
      }
      return flag
    }
  },
  watch: {
    getUserRole() {
      this.reset()
      this.$refs.menuLeft.setMenu(0)
      this.selectType = 0
    },
    getCourtId() {
      this.reset()
      console.log('切换了角色')
      this.$refs.menuLeft.setMenu(0)
      this.selectType = 0
    }
  },
  created() {
    this.getCaseSource()
    this.getTypeArr()
  },
  activated() {
    this.getCaseList()
  },
  mounted() {
    // 禁止页面跳转到首页后再后退
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function() {
      history.pushState(null, null, document.URL)
    })
  },
  methods: {
    // 获取案件类型
    getTypeArr() {
      this.applyTypeData = []
      for (const key in CASETYPE) {
        this.applyTypeData.push({ id: CASETYPE[key], value: CASETYPE[key] })
      }
    },
    // // 刷新后重新获取搜索条件
    // getSearchCondition() {
    //   this.searchParams = localStorage.set
    // },
    // 搜索
    search() {
      this.searchParams.pageNum = 1
      this.getCaseList()
    },
    // 重置案件时间排序
    clearOrder() {
      this.searchParams.order = 'desc'
    },
    // 重置案件状态搜索条件
    clearDealType() {
      this.searchParams.dealType = 1
    },
    // 受理时间排序
    sortTime(a, b) {
      const a1 = a.acceptanceDate
      const b1 = b.acceptanceDate
      return a1 - b1
    },
    // 获取案件列表信息
    getCaseList() {
      this.loading = true
      const params = { ...this.searchParams }
      if (!this.isNeedHandleUnit) {
        params.flowCourtId = ''
      }
      params.type = this.selectType
      if (this.searchTime && this.searchTime.length > 0) {
        params.startTime = formatDate(new Date(this.searchTime[0]).getTime(), 'YYYY-MM-DD')
        params.endTime = formatDate(new Date(this.searchTime[1]).getTime(), 'YYYY-MM-DD')
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      if (params.flowCourtId) {
        params.selfType = this.selfType
      } else {
        params.selfType = null
      }
      // localStorage.setItem(`${SYS_NAME}_search_condition`, JSON.stringify(params))
      listCase2(params).then(res => {
        this.loading = false
        if (res.state === 100) {
          // this.tableData = res.data.content
          // this.tableData.applicant = res.litigants[1]
          // this.tableData.respondent = res.litigants[2]
          this.listCastTotal = res.data.total
          console.log(this.listCastTotal)
          this.tableData = res.data.content.map((item, index) => {
            item.num = index + 1
            item.applicant = res.litigants[index][1]
            item.respondent = res.litigants[index][2]
            item.dealUser = item.currentName
            item.acceptanceDate = item.acceptanceDate || item.registerDate
            let str = ''
            // if (item.pro == '6' && !item.caseClose) {
            //   if (this.endTypes.indexOf(item.endType) == -1) {
            //     str = `化解失败(${item.endType})`
            //   } else {
            //     str = `化解成功(${item.endType})`
            //   }
            // } else {
            //   str = item.process
            // }
            str = item.process
            item.status = str
            return item
          })
          console.log(this.tableData)
        }
      })
    },
    // 重置
    reset() {
      this.searchParams = {
        pageSize: 10,
        pageNum: 1,
        dealType: 1,
        order: 'desc'
      }
      this.$refs.brief.reset()
      this.$refs.elSelectTree.reset()
      this.searchTime = ''
      this.getCaseList()
    },
    // 跳转详情
    getDetail(id) {
      this.$store.commit('SET_CASEID', id)
      this.$store.commit('SET_MENUTYPE', this.selectType)
      this.$router.push('/case')
    },
    // 分流
    shunt(id) {},
    // 改变一页显示多少条
    handleSizeChange(e) {
      this.searchParams.pageSize = e
      this.searchParams.pageNum = 1
      this.getCaseList()
    },
    // 上一页
    caseListPrev(index) {
      console.log('----上一页---------')
      this.searchParams.pageNum = index
      this.getCaseList()
    },
    // 下一页
    caseListNext(index) {
      this.searchParams.pageNum = index
      this.getCaseList()
    },
    // 选择第几页
    caseListPage(index) {
      this.searchParams.pageNum = index
      this.getCaseList()
    },
    selectMenu(index) {
      // dealTypeData: [
      //   {
      //     value: 0,
      //     label: '全部案件'
      //   },
      //   {
      //     value: 1,
      //     label: '待办理'
      //   },
      //   {
      //     value: 2,
      //     label: '已办理'
      //   }
      // ],
      switch (index) {
        // case 2:
        //   this.dealTypeData = [
        //     {
        //       value: 0,
        //       label: '全部案件'
        //     },
        //     {
        //       value: 1,
        //       label: '待协同'
        //     },
        //     {
        //       value: 2,
        //       label: '已协同'
        //     }
        //   ]
        //   break
        // case 3:
        //   this.dealTypeData = [
        //     {
        //       value: 0,
        //       label: '全部案件'
        //     },
        //     {
        //       value: 1,
        //       label: '待赋强'
        //     },
        //     {
        //       value: 2,
        //       label: '已赋强'
        //     }
        //   ]
        //   break
        // case 4:
        //   this.dealTypeData = [
        //     {
        //       value: 0,
        //       label: '全部案件'
        //     },
        //     {
        //       value: 1,
        //       label: '待立案'
        //     },
        //     {
        //       value: 2,
        //       label: '已立案'
        //     }
        //   ]
        //   break
        default:
          this.dealTypeData = [
            {
              value: 0,
              label: '全部案件'
            },
            {
              value: 1,
              label: '待办理'
            },
            {
              value: 2,
              label: '已办理'
            }
          ]
      }
      this.$refs.menuLeft.setMenu(index)
      this.selectType = index
      this.searchParams.pageNum = 1
      this.getCaseList()
    },
    selectMenu1(index) {
      this.menu1 = index
      this.process = index
      this.getCaseList()
    },
    getRadio(index) {
      console.log(index)
      this.selfType = index
    },
    // 获取案件来源
    getCaseSource() {
      getCaseSource().then(res => {
        if (res.state === 100) {
          this.caseSourceData = res.data.map(item => {
            return {
              value: item,
              label: item
            }
          })
        }
      })
    },
    // 通过名字查询获取当前办理数据
    getListGoalByName(e) {
      console.log(e)
      listGoalByName({ name: e }).then(res => {
        if (res.state === 100) {
          if (res.content && res.content.length > 0) {
            this.listGoalData = res.content.map(item => {
              return {
                value: item[0],
                label: item[1]
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';
.se-brief {
  width: 185px;
  display: inline-flex;
  height: 35px;
  margin-right: 10px;
  ::v-deep.select-wrapper {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  ::v-deep.el-icon-arrow-up {
    color: #2c2c2c;
    top: -1px;
  }
}
.case-list-wrapper {
  display: flex;
  &>.left-wrapper {
    width: calc(var(--fz) * 10);
  }
  &>.right-wrapper {
    width: calc(100% - var(--fz) * 10);
    min-height: 300px;
    background-color: #fff;
    box-shadow: 0 3px 6px rgba(0,0,0,.16);
    .search-wrapper {
      padding: 20px 30px;
      padding-right: 300px;
      padding-bottom: 10px;
      border-bottom: 5px solid #F2F5FA;
      position: relative;
      ::v-deep .el-select {
        margin-right: 12px;
      }
      ::v-deep .el-input {
        margin-right: 12px;
        margin-bottom: 10px;
      }
      ::v-deep .el-date-editor .el-range-separator {
        width: auto;
        line-height: 24px;
      }
      .search-btn-wrapper {
        position: absolute;
        right: 30px;
        top: 20px;
        ::v-deep .el-button {
          height: 30px;
          line-height: 30px;
          padding: 0 20px;
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
    .list-wrapper-wrapper {
      padding: 30px;
    }
    .opera-btn {
      color: #007AFF;
      font-weight: bold;
      a {
        text-decoration:underline;
      }
      span {
        display: inline-block;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
    ::v-deep .el-table thead {
      color: #2c2c2c;
      font-weight: 600;
      font-size: 15px;
      tr th {
        &::last-child {
          color: #007AFF;
        }
      }
    }
    .page-wrapper {
      text-align: right;
      padding: 20px 30px;
      border-top: 5px solid #F2F5FA;
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
        }
      }
      border-bottom: 5px solid #F2F5FA;
    }
  }
}
</style>
