<template>
  <el-card class="box-card" :body-style="bodyStyle">
    <div class="search-wrapper">
      <!-- <el-input v-model="value" class="search-item" placeholder="解纷组织名称" type="text" />
      <el-select v-model="value" class="search-item" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="searcn-btn search">搜索</el-button>
      <el-button class="searcn-btn reset">重置</el-button> -->
      <a class="ranking" @click="ranking">排行榜 {{ asdda }}<i class="el-icon-arrow-right" /></a>
    </div>
    <div class="court-wrapper">
      <mediatorItem v-for="(item, index) in courtData" :key="index" class="active" :item="item" :active="selectCourtData.id == item.id" @click.native="selectCourt(item)" />
    </div>
    <div class="page-wrapper" style="text-align: right;">
      <el-pagination
        background
        :page-size="searchParams.pageSize"
        layout="prev, pager, next"
        :total="listCastTotal"
        @prev-click="caseListPrev"
        @next-click="caseListNext"
        @current-change="caseListPage"
      />
    </div>
    <div class="footer">
      <el-button class="back" @click="back">返回</el-button>
      <el-button class="submit" @click="next">确定</el-button>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'解纷员排行榜'"
      append-to-body
      width="800px"
      :visible.sync="detailVisible"
    >
      <meditorLeaderBoard />
    </el-dialog>
  </el-card>
</template>

<script>
import mediatorItem from './components/mediatorItem'
import { getMediaterUser } from '@/api/common/common'
import meditorLeaderBoard from '@/components/leaderboard/meditor'
export default {
  components: {
    mediatorItem,
    meditorLeaderBoard
  },
  data() {
    return {
      bodyStyle: {
        width: '97%',
        height: '95%'
      },
      value: '',
      options: [],
      searchParams: {
        pageSize: 8
      },
      listCastTotal: 0,
      courtData: [],
      selectCourtData: '',
      detailVisible: false,
      tableData: []
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
    this.listCourt()
  },
  methods: {
    listCourt() {
      if (this.$store.state.litigant.courtData.id) {
        this.searchParams.courtId = this.$store.state.litigant.courtData.id
      } else {
        this.searchParams.caseId = localStorage.getItem('lawCaseId')
      }
      getMediaterUser(this.searchParams).then(res => {
        if (res.state === 100) {
          this.courtData = res.dataPage.content
          this.listCastTotal = res.dataPage.total
        }
      })
    },
    // 上一页
    caseListPrev(index) {
      console.log('----上一页---------')
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 下一页
    caseListNext(index) {
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 选择第几页
    caseListPage(index) {
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 选择机构
    selectCourt(item) {
      this.selectCourtData = item
    },
    // 返回
    back() {
      this.$router.push({ name: 'step5' })
    },
    next() {
      if (!this.selectCourtData) {
        this.$message.error('请先选择解纷组织')
        return
      }
      const data = {
        id: this.selectCourtData.id,
        name: this.selectCourtData.name
      }
      this.$store.commit('SET_MEDIATOR', data)
      this.$router.push({ name: 'step5' })
    },
    ranking() {
      this.detailVisible = true
    }
  }
}
</script>

<style scoped lang = "scss">
.box-card {
  width: 95%;
  position: absolute;
  left: 2.5%;
  overflow: auto;
  .ranking {
    color: #007AFF;
    float: right;
  }
  .search-wrapper {
    .search-item {
      width: 200px;
      margin-right: 10px;
    }
    .searcn-btn {
      padding: 8px 15px;
      margin-right: 15px;
    }
    .search {
      margin-left: 5px;
      color: #fff;
      background-color: #007AFF;
    }
    .reset {
      color: #007AFF;
      border-color: #007AFF;
    }
  }
  .court-wrapper {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .court-item {
      width: 25%;
    }
  }
  .footer {
    margin-top: 40px;
    text-align: right;
    .submit {
      background-color: #007AFF;
      color: #fff;
    }
    .back {
      color: #007AFF;
      border-color: #007AFF;
    }
  }
}
</style>
