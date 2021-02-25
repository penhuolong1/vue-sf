<template>
  <div class="mediate-wrapper">
    <div class="wrapper">
      <div class="search-wrapper">
        <div class="search-item">
          <div class="search-content">
            <el-input
              v-model="listCaseParams.sqCaseNo"
              placeholder="请输入案号"
              class="search-input"
              @keyup.enter.native="search"
            >
              <div
                slot="suffix"
                class="search-icon-text"
                @click="search"
              >
                <span>搜索</span>
              </div>
            </el-input>
            <el-date-picker
              v-model="searchTime"
              class="search-time"
              type="daterange"
              range-separator="/"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="search"
            />
            <briefTree ref="brief" v-model="listCaseParams.briefId" class="se-brief" />
            <el-select v-model="listCaseParams.endType" placeholder="请选择化解结果" clearable>
              <!-- <el-option v-for="(item,index) in mediateResult" :key="index" :label="item.label" :value="item.id" /> -->
              <el-option-group
                v-for="(item, index) in mediateResult"
                :key="index"
                :label="item.label"
              >
                <el-option
                  v-for="(item1, index1) in item.children"
                  :key="index1"
                  :label="item1.label"
                  :value="item1.id"
                />
              </el-option-group>
            </el-select>
            <el-checkbox v-model="listCaseParams.judicial">是否司法确认</el-checkbox>
            <div class="search-btn-wrapper">
              <el-button class="search" @click="search">搜索</el-button>
              <el-button class="reset" @click="reset">重置</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="listCaseData"
          tooltip-effect="dark"
          style="width: 100%"
          class="my-table-1"
        >
          <el-table-column
            label="序号"
            prop="num"
            width="80"
          />
          <el-table-column
            label="案号"
            width="200"
          >
            <template slot-scope="scope">
              <span style="cursor: pointer;">{{ scope.row.sqCaseNo }}</span>
              <!-- <span style="cursor: pointer;" @click="toCaseDetail(scope.row.id)">{{ scope.row.sqCaseNo }}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            label="申请人/被申请人"
          >
            <template slot-scope="scope">
              <p>申请人:{{ scope.row.applicant }}</p>
              <p>被申请人:{{ scope.row.respondent }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="briefName"
            label="事由"
          />
          <el-table-column
            prop=""
            label="解纷类型"
            width="160"
          >
            <template slot-scope="scope">
              <div class="type-wrapper">
                <div
                  class="item"
                  :class="{'active': scope.row.mediateType == 1}"
                  @click="getMediateType(scope.row.num, 1)"
                >远程解纷</div>
                <div
                  class="item"
                  :class="{'active': scope.row.mediateType == 2}"
                  @click="getMediateType(scope.row.num, 2)"
                >现场解纷</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="解纷时间">
            <template slot-scope="scope">
              <span>{{ scope.row.mediateTime | timeDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="案件状态">
            <template slot-scope="scope">
              <span>{{ scope.row.process }}</span>
            </template>
          </el-table-column>
          <el-table-column label="解纷录像">
            <template slot-scope="scope">
              <a @click="getVideoList(scope.row.id)">解纷录像</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="mediaterName"
            label="解纷员"
          />
          <el-table-column
            prop=""
            label="解纷室状态"
          >
            <template slot-scope="scope">
              <div class="btn-wrapper">
                <div
                  v-if="scope.row.mediateType == 1 && (scope.row.pro == 4 || scope.row.pro == 5)"
                  class="btn-wrapper-right"
                  @click="toMediationRoom(scope.row.id, scope.row.sqCaseNo, scope.row.pro)"
                >
                  <span class="icon icon-blue" />
                  <span class="text">进入解纷</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper">
        <el-pagination
          background
          :page-size="listCaseParams.pageSize"
          :pager-count="5"
          layout="prev, pager, next"
          :total="listCastTotal"
          @prev-click="caseListPrev"
          @next-click="caseListNext"
          @current-change="caseListPage"
        />
      </div>
    </div>
    <el-dialog
      title="邀请调解"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <el-checkbox-group v-model="selectCurrentManList">
        <el-checkbox v-for="(item, index) in currentManList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setCurr">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="解纷录像"
      :visible.sync="videoVisible"
      width="600px"
      :append-to-body="true"
    >
      <el-table
        v-loading="videoLoading"
        :data="videoList"
        tooltip-effect="dark"
      >
        <el-table-column
          prop="fileName"
          label="录像名称"
        />
        <el-table-column
          prop="time"
          label="上传时间"
        />
        <el-table-column
          prop="distance"
          label="视频时长"
        />
        <el-table-column label="解纷录像">
          <template slot-scope="scope">
            <a @click="lookVideo(scope.row.fileUrl)">查看</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right;"
        layout="prev, pager, next"
        :page-size="videoPage.pageSize"
        :total="videoPage.totalPage"
        @prev-click="prev"
        @next-click="next"
        @current-change="pager"
      />
    </el-dialog>
    <el-dialog
      title="查看录像"
      :visible.sync="lookVideoVisible"
      width="800px"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <video v-if="lookVideUrl" id="movie" class="video" :src="lookVideUrl" controls />
    </el-dialog>
  </div>
</template>

<script>
import briefTree from '@/components/brief/index.vue'
import { listCaseOL, intoTalkRoom, brief, getCurrentMan, setCurrentMan } from '@/api/case/index.js'
import { verifyHasCard } from '@/api/mediater/mediater.js'
import { intoRoom, addChatGroup, listVideo } from '@/api/rtcRoom/rtcRoom.js'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    briefTree
  },
  props: {},
  data() {
    return {
      lookVideoVisible: false,
      lookVideUrl: '', // 预览的url
      videoLoading: false, // 录像列表加载
      videoList: [], // 录像列表
      videoVisible: false,
      listCaseParams: {
        pageNum: 1,
        pageSize: 10,
        examine: null, // 是否审核
        mediate: null, // 是否解纷
        briefId: '',
        accept: 1,
        teamWork: 0
      }, // 案件列表搜索条件
      videoPage: {
        pageNum: 1, // 当前页
        pageSize: 5, // 每页展示多少个
        totalPage: 1 // 总条数
      },
      videoId: null,
      searchTime: '',
      value1: '',
      listCaseData: [], // 案件列表数据
      listCastTotal: 0, // 案件列表总数
      loading: true,
      caseId: null, // 案件ID
      briefData: [], // 案由信息
      dialogVisible: false,
      currentManList: [], // 案件相关人员
      selectCurrentManList: [], // 案件选择的相关人员
      mediateResult: [
        {
          label: '化解成功',
          children: [
            {
              id: '当事人达成和解',
              label: '当事人达成和解'
            },
            {
              id: '当事人撤诉',
              label: '当事人撤诉'
            }
          ]
        },
        {
          label: '化解失败',
          children: [
            {
              id: '联系不到当事人',
              label: '联系不到当事人'
            },
            {
              id: '当事人撤回调解请求',
              label: '当事人撤回调解请求'
            },
            {
              id: '当事人明确表示不接受调解',
              label: '当事人明确表示不接受调解'
            },
            {
              id: '双方分歧较大且难以达成调解协议',
              label: '双方分歧较大且难以达成调解协议'
            },
            {
              id: '其他',
              label: '其他(请备注说明)'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    this.getCaseListData()
    this.getBrief()
  },
  methods: {
    // 查看录像
    lookVideo(url) {
      if (!url.includes('https')) { // 预览的时候把http转陈https不然本地开发的时候会报错预览不了视频
        this.lookVideUrl = url.replace(/http/g, 'https')
      } else {
        this.lookVideUrl = url
      }
      this.lookVideoVisible = true
    },
    // 获取解纷视频的列表
    getVideoList(id) {
      this.videoId = id
      this.videoLoading = true
      const params = {
        caseId: id,
        pageNum: this.videoPage.pageNum,
        pageSize: this.videoPage.pageSize
      }
      listVideo(params).then(res => {
        this.videoLoading = false
        if (res.state === 100) {
          this.videoVisible = true
          this.videoList = res.data.content.map((item, index) => {
            item.index = index + 1
            item.time = formatDate(item.startAtDate)
            item.fileName = item.fileUrl.split('/').pop()
            return item
          })
          this.videoPage.totalPage = res.data.total
        }
      })
    },
    search() {
      this.searchCardList()
    },
    add() {
      if (this.isCaseCenter == 1) {
        this.$emit('add')
      } else {
        this.caseId = ''
      }
    },
    // 设置参加调解的人
    setCurr() {
      console.log(this.caseId)
      console.log(this.selectCurrentManList)
      const list = []
      this.currentManList.forEach((item, index) => {
        const index1 = this.selectCurrentManList.findIndex(item1 => item1 == item.id)
        if (index1 != -1) {
          list.push(item)
        }
      })
      if (list && list.length > 0) {

      } else {
        this.$message.error('请选择邀请人')
        return
      }
      return
      const params = {
        caseId: this.caseId,
        currentMan: JSON.stringify(this.selectCurrentManList)
      }
      console.log(this.selectCurrentManList)
      setCurrentMan(params).then(res => {
        if (res.state === 100) {

        }
      })
    },
    // 获取案件列表
    getCaseListData() {
      this.loading = true
      console.log(this.listCaseParams.time)
      if (this.searchTime && this.searchTime.length > 0) {
        this.listCaseParams.startTime = formatDate(
          new Date(this.searchTime[0]).getTime(),
          'YYYY-MM-DD'
        )
        this.listCaseParams.endTime = formatDate(
          new Date(this.searchTime[1]).getTime(),
          'YYYY-MM-DD'
        )
      } else {
        this.listCaseParams.startTime = ''
        this.listCaseParams.endTime = ''
      }
      const params = {
        ...this.listCaseParams
      }
      params.judicial = params.judicial ? 1 : 0
      listCaseOL(params).then(res => {
        this.listCastTotal = res.data.total
        this.listCaseData = res.data.content.map((item, index) => {
          item.num = index + 1
          item.mediateType = 1
          item.applicant = res.litigants[index][1]
          item.respondent = res.litigants[index][2]
          return item
        })
        this.loading = false
      })
    },
    // 搜索案件列表
    searchCardList() {
      this.getCaseListData()
    },
    // 上一页
    caseListPrev(index) {
      console.log('----上一页---------')
      this.listCaseParams.pageNum = index
      this.searchCardList()
    },
    // 下一页
    caseListNext(index) {
      this.listCaseParams.pageNum = index
      this.searchCardList()
    },
    // 选择第几页
    caseListPage(index) {
      this.listCaseParams.pageNum = index
      this.searchCardList()
    },
    // 录音的选择
    // 上一页
    prev() {
      this.videoPage.pageNum--
      this.getVideoList(this.videoId)
    },
    // 下一页
    next() {
      this.videoPage.pageNum++
      this.getVideoList(this.videoId)
    },
    // 第几页
    pager(pageNum) {
      console.log(pageNum)
      this.videoPage.pageNum = pageNum
      this.getVideoList(this.videoId)
    },
    // 点击关闭
    handleClose() {
      var video = document.getElementById('movie')
      video.pause() // 暂停控制
      this.lookVideoVisible = false
    },
    // 跳转到解纷室
    async toMediationRoom(id, sqCaseNo, pro) {
      this.caseId = id
      this.$store.commit('SET_CASEID', id)
      this.$store.commit('SET_ISOPEN', '')
      verifyHasCard({ lawCaseId: id }).then(async res => {
        if (res.state == 100) {
          let flag = false
          if (pro == 4) {
            await this.$store.dispatch('GetTeamData', id).then(async res => {
              if (res.state === 100) {
                if (res.team) {
                  if (res.type == 2) {
                    flag = true
                    this.$message.error('你不是该案件得调解员和主要办案人员不能开启调解室')
                  } else {
                    await intoTalkRoom({ caseId: id })
                    await addChatGroup({ caseId: id, loginId: this.getUserInfo.result.id })
                    // this.dialogVisible = true
                    // this._getCurrentMan(id)
                  }
                } else {
                  await intoTalkRoom({ caseId: id })
                  await addChatGroup({ caseId: id, loginId: this.getUserInfo.result.id })
                  // this._getCurrentMan(id)
                  // this.dialogVisible = true
                }
              }
            })
          }
          if (flag) {
            return
          }
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
    _getCurrentMan(id) {
      getCurrentMan({ caseId: id }).then(res => {
        if (res.state === 100) {
          this.currentManList = res.data.content
        }
      })
    },
    // 进入房间并获取token
    async intoRoom(id) {
      let token = ''
      await intoRoom({ caseId: id, permission: 'admin' }).then(res => {
        // this.$emit('getRoomToken')
        token = res.result
        this.$store.commit('SET_ISOPEN', res.is_open)
      })
      this.$store.commit('SET_ROOMTOKEN', token)
    },
    getBrief() {
      brief({ pageSize: 100 }).then(res => {
        const start = [
          {
            name: '所有案由',
            id: ''
          }
        ]
        this.briefData = [...start, ...res.briefPage.content]
      })
    },
    // 重置
    reset() {
      this.listCaseParams.sqCaseNo = ''
      this.searchTime = ''
      this.listCaseParams.briefId = ''
      this.listCaseParams.endType = ''
      this.listCaseParams.judicial = false
      this.$refs.brief.reset()
      this.search()
    },
    // 选择解纷方式
    getMediateType(index, num) {
      this.listCaseData[index - 1].mediateType = num
    }
    // 跳转到案件详情
    // toCaseDetail(id) {
    //   this.$router.push({
    //     path: '/home/caseCenter',
    //     query: {
    //       id: id
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
.video {
  width: 750px;
  height: 500px;
}
.search-content {
  display: flex;
  align-items: center;
}
.se-brief {
  width: 185px;
  display: inline-block;
  height: 30px;
  margin-right: 10px;
  font-size: 0px;
  .select-wrapper {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .el-icon-arrow-up {
    color: #2c2c2c;
    top: 1px!important;
  }
}
.mediate-wrapper {
  .header {
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    padding-left: 30px;
    border-bottom: 1px solid rgba(221, 223, 225, 0.55);
  }
}
.tab-box {
  margin-top: 30px;
}
.table-wrapper {
  margin-top: 3px;
  padding: 20px 30px;
}
.search-wrapper {
  padding: 20px 30px;
  padding-right: 300px;
  padding-bottom: 10px;
  position: relative;
  border-bottom: 5px solid #F2F5FA;
  .search-btn-wrapper {
    position: absolute;
    right: 30px;
    top: 20px;
    .search {
      background-color: #007AFF;
      color: #FFf;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
    }
    .reset {
      border-color: #007AFF;
      color: #007AFF;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
    }
  }
  .search-input {
    .el-input__inner {
      max-width: 230px;
      width: 230px;
    }
    .search-icon-text {
      padding: 0 5px;
      cursor: pointer;
      span {
        font-size: 12px;
        color: $themeColor;
      }
    }
  }
  .search-time {
    max-width: 300px;
    margin-right: 20px;
    .el-range-separator {
      line-height: 24px;
    }
  }
}
.my-table-1 {
  text-align: center;
  margin-top: 10px;
  .btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px;
    .btn-wrapper-left,
    .btn-wrapper-right {
      flex: 1;
      cursor: pointer;
      .text {
        font-size: 12px;
        color: #464a53;
      }
      .icon {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
        &.icon-yellow {
          background-color: #fec500;
          box-shadow: 0px 3px 6px rgba(254, 197, 0, 1);
        }
        &.icon-blue {
          background-color: #2475fe;
          box-shadow: 0px 3px 6px rgba(36, 117, 254, 1);
        }
      }
    }
    .scheduled-wrapper {
      .scheduled-btn {
        background-color: #dddfe1;
        padding: 0 20px;
        border-radius: 15px;
        height: 30px;
        line-height: 30px;
        margin-top: 15px;
        color: #464a53;
        font-size: 12px;
      }
    }
  }
  &.el-table {
    .type-wrapper {
      line-height: 25px;
      display: flex;
      .item {
        flex: 1;
        width: 70px;
        height: 25px;
        line-height: 25px;
        background-color: #fff;
        border: 1px solid #dddfe1;
        cursor: pointer;
        &.active {
          background-color: #73d500;
          color: #fff;
          border: none;
        }
      }
    }
    td,
    th {
      text-align: center;
      border-bottom: 0px;
      padding: 0;
      padding-bottom: 15px;
      font-size: 14px;
      color: #131026;
    }
    td {
      .cell {
        background-color: #f7f8fa;
        min-height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p {
          line-height: normal;
        }
      }
    }
    tr {
      td {
        &:first-child {
          .cell {
            border-radius: 10px 0 0 10px;
          }
        }
        &:last-child {
          .cell {
            border-radius: 0 10px 10px 0;
          }
        }
      }
      &.el-table__row {
        &:hover {
          td {
            background-color: white;
          }
        }
      }
    }
    th {
      color: #131026;
      font-size: 14px;
    }
    .el-button {
      padding: 0px 10px;
      line-height: 30px;
      border-radius: 15px;
      font-size: 12px;
      color: #fff;
      border: none;
      &.test {
        background-color: #fec500;
      }
      &.begin {
        background-color: #2475fe;
      }
      &.being {
        background-color: #23eaa4;
      }
      &.unscheduled {
        background-color: #dddfe1;
      }
    }
  }
}
.page-wrapper {
  overflow: hidden;
  padding: 20px 30px;
  border-top: 5px solid #F2F5FA;
  margin-top: 10px;
  .el-pagination {
    float: right;
    border: 1px solid rgba(224, 227, 233, 1);
    border-radius: 5px;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: $themeColor;
  }
}
.table-dropdown {
  &.el-dropdown-menu {
    position: relative;
  }
}
.btn-wrapper .el-button {
  margin-top: 0px !important;
}
</style>
